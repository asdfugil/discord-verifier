'use strict'
const events = require('events')
let enabled = true
module.exports = {
	Verifier: class extends events {
		constructor(verifierOptions) {
			super()
			this.count = 0
			this.channel = verifierOptions.channel
			this.agreeMessage = verifierOptions.agreeMessage || 'agree'
			this.role = verifierOptions.role || 'Member'
			return this
		}
		run(message) {
			if (!enabled) return
			if (message.author.bot) return
			if (!message.guild) return
			if (message.content === (this.agreeMessage || 'agree') && message.channel.id === this.channel) {
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
			enabled = false
			return this
		}
		resume() {
			enabled = true
			return this
		}
	}
}