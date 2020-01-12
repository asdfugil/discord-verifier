# discord-verifier
discord verification system for discord.js

To install:```npm i discord-verifier```

## Example

```js
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
```

## Documentation

### Classes

#### MessageVerifier extends [EventEmitter](https://nodejs.org/api/events.html)

A message verifier

##### Constructor

```js
new MessageVerifier(MessageVerifierOptions)
```

##### Properties

###### .count

No. of verified members

###### .channelID

ID of the verification channel

###### .role

Name of the verified role

###### .agreeMessage

The message that will trigger the verifier

###### .enabled

If the verifier is enabled

##### Methods

###### .run(message) 

Run the verifier, accpet a discord.js message object  as a parameter.

###### .pause()

Stop the verifier (disable run())

###### .resume()

Resume the verifier (enable run())

#### Events

###### Verified

Emitted when a member is verified

Parameter : The verified member

#### ReactionVerifier extends [EventEmitter](https://nodejs.org/api/events.html)

##### Constructor

```js
new ReactionVerifier(reactionVerifierOptions)
```

##### Properties

###### .count

No. of verified members

###### .channelID

ID of the verification channel

###### .role

Name of the verified role

###### .messageID

ID of the message of the verify reactions 

###### .agreeEmoji

The agree unicode emoji

###### .enabled

If the verifier is enabled

##### Methods

###### run(packet,client) 

Run the verifier, accpet a raw packet as the first parameter and accept a disocrd.js client object as the second parameter.

###### pause()

Stop the verifier (disable run())

###### resume()

Resume the verifier (enable run())

#### Events

###### Verified

Emitted when a member is verified

Parameter : The verified member

### Type Definitions

#### packet

A packet emitted by the 'raw' client event

#### MessageVerifierOptions

Options for message verifiers

```ts
import { Snowflake } from 'discord.js'
/**Options for message verifiers*/
type MessageVerifierOptions = {
    /**Name of the verified role */
    role?: string
    /**Content of the message that will trigger the verifier */
    agreeMessage?: string
    /**ID of the verification channel */
    channelID: Snowflake
}
```

#### ReactionVerifierOptions

Options for reaction verifiers

```ts
import { Snowflake } from 'discord.js'
/**Options for reaction verifiers */
type ReactionVerifierOptions = {
    /**A unicode emoji*/
    agreeEmoji?: string
    /**Name of the verified role */
    role?: string
    /**The ID of the message that the verify reaction should be applied to.*/
    messageID: Snowflake
    /**The ID of the channel that the message of the reaction should be in.*/
    channelID: Snowflake
}
```

