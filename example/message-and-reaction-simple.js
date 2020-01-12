const { Client } = require('discord.js')
const Client = new Client()
const { MessageVerifier,ReactionVerifier } = require('discord-verifier')
const messageVerifiers = [
    new MessageVerifier({
        channel:'123456789012345678',
        role:'Verified',
        agreeMessage:'I agree',
    }),
    new MessageVerifier({
        channel:'123456789012345671'
        //role can be omitted, default to 'Member'
        //agreeMessage can also be omitted,defult to 'agree'
    })
]
const reactionVerifiers = [
    new ReactionVerifier({
         channelID:'100000000000000000',
         role:'Verified',
         agreeEmoji:'🤝',
         messageID:'598765432109124567'
    }),
    new ReactionVerifier({
         messageID:'598765412109124567',
         channelID:'100000000000004000',
        //role can be omitted, default to 'Member'
        //agreeEmoji can be omitted,default to '✅'
    })
]
client.on('message',message => {
    messageVerifiers.forEach(v => v.run(message))
})
client.on('raw',packet => reactionVerifiers.forEach(v => v.run(packet,client)))
client.login('xxxxxxxxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxx.xxxxxx')
