'use strict'
const events = require('events')
module.exports = {
	MessageVerifier: class extends events {
		constructor(messageVerifierOptions) {
			super()
			this.count = 0
			this.channelID = messageVerifierOptions.channelID
			this.enabled = true
			this.agreeMessage = messageVerifierOptions.agreeMessage || 'agree'
			this.role = messageVerifierOptions.role || 'Member'
			return this
		}
		run(message) {
			if (!this.enabled) return
			if (message.author.bot) return
			if (!message.guild) return
			if (message.content === (this.agreeMessage || 'agree') && message.channel.id === this.channelID) {
				if (!message.channel.permissionsFor(message.guild.me).serialize().SEND_MESSAGES) return console.error("The bot doesn't have the permission to send messages.@" + message.guild.name)
				if (!message.channel.permissionsFor(message.guild.me).serialize().ADD_REACTIONS) {
					const a = "The bot doesn't have the permission to add reactions."
					console.error(a + "@" + + message.guild.name)
					message.channel.send("The bot doesn't have the permission to add reactions.")
						.then(m => m.delete(20000))
					return
				}
				if (!message.channel.permissionsFor(message.guild.me).serialize().MANAGE_MESSAGES) {
					const a = "The bot doesn't have the permission to delete messages."
					console.error(a + "@" + message.guild.name)
					message.channel.send(a)
						.then(m => m.delete(20000))
					return
				}
				const messageRole = message.guild.roles.find(role => role.name === this.role || "Member")
				if (messageRole == null) {
					const a = 'The role does not exist'
					console.error(a + "@" + message.guild.name)
					return message.channel.send(a)
						.then(m => m.delete(20000))
				}

				if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
					const a = "The bot doesn't have the permission required to assign roles."
					console.error(a + '@' + message.guild.name)
					message.channel.send("The bot doesn't have the permission required to assign roles.")
						.then(m => m.delete(20000))
					return
				}
				if (message.guild.me.highestRole.comparePositionTo(messageRole) < 1) {
					const a = "The position of this role is higher than the bot's highest role,it cannot be assigned by the bot."
					console.error(a + "@" + message.guild.name)
					message.channel.send(a)
						.then(m => m.delete(20000))
					return
				}
				if (messageRole.managed == true) {
					const a = "This is a auto managed role,it cannot be assigned"
					console.error(a + "@" + message.guild.name)
					message.channel.send(a)
					this.emit('error')
						.then(m => m.delete(20000))
					return
				}
				if (message.member.roles.has(messageRole.id)) return;
				message.react('✅')
				message.member.addRole(messageRole)
					.then(m => {
						message.delete(5000)
						this.count++
						this.emit('Verified', message.member)
					})
					.catch(error => {
						console.error(error.stack)
						message.channel.send(error.stack, { code: "xl" })
							.then(m => m.delete(20000))
					})
			}
		}
		pause() {
			this.enabled = false
			return this
		}
		resume() {
			this.enabled = true
			return this
		}
	},
	ReactionVerifier: class extends events {
		constructor(reactionVerifierOptions) {
			super()
			this.count = 0
			this.agreeEmoji = reactionVerifierOptions.agreeEmoji || '✅'
			this.role = reactionVerifierOptions.role || 'Member'
			this.messageID = reactionVerifierOptions.messageID
			this.enabled = true
			this.channelID = reactionVerifierOptions.channelID
			return this
		}
		run(packet, client) {
			if (!this.enabled) return
			if (packet.t !== "MESSAGE_REACTION_ADD") return
			if (!packet.d.guild_id) return
			if (packet.d.message_id != this.messageID) return
			if (this.agreeEmoji !== packet.d.emoji.name) return
			client.fetchUser(packet.d.user_id)
				.then(user => client.guilds.get(packet.d.guild_id).fetchMember(user))
				.then(async member => {
					if (member.roles.has(this.role)) return
					const message = await client.channels.get(this.channelID).fetchMessage(packet.d.message_id)
						.catch(error => {
							console.error(error)
							return
						})
					if (!message.channel.permissionsFor(message.guild.me).serialize().SEND_MESSAGES) return console.error("The bot doesn't have the permission to send messages.@" + message.guild.name)
					if (!message.channel.permissionsFor(message.guild.me).serialize().MANAGE_MESSAGES) {
						const a = "The bot doesn't have the permission to delete messages."
						console.error(a + "@" + message.guild.name)
						message.channel.send(a)
							.then(m => m.delete(20000))
						return
					}
					const reactionRole = message.guild.roles.find(role => role.name === this.role || "Member")
					if (reactionRole == null) {
						const a = 'The role does not exist'
						console.error(a + "@" + message.guild.name)
						return message.channel.send(a)
							.then(m => m.delete(20000))
					}
					if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
						const a = "The bot doesn't have the permission required to assign roles."
						console.error(a + '@' + message.guild.name)
						message.channel.send("The bot doesn't have the permission required to assign roles.")
							.then(m => m.delete(20000))
						return
					}
					if (message.guild.me.highestRole.comparePositionTo(reactionRole) < 1) {
						const a = "The position of this role is higher than the bot's highest role,it cannot be assigned by the bot."
						console.error(a + "@" + message.guild.name)
						message.channel.send(a)
							.then(m => m.delete(20000))
						return
					}
					if (reactionRole.managed == true) {
						const a = "This is a auto managed role,it cannot be assigned"
						console.error(a + "@" + message.guild.name)
						message.channel.send(a)
						this.emit('error')
							.then(m => m.delete(20000))
						return
					}
					member.addRole(reactionRole)
						.then(() => {
							this.count++
							this.emit('Verified', member)
						})
						.catch(error => {
							console.error(error.stack)
							message.channel.send(error.stack, { code: "xl" })
								.then(m => m.delete(20000))
						})
				})
			return this
		}
		pause() {
			this.enabled = false
			return this
		}
		resume() {
			this.enabled = true
			return this
		}
	}
}