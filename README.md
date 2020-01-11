# discord-verifier
discord verification system for discord.js
To install:```npm i discord-verifier```


## Example

Multiple verifiers:

```js
const { Client } = require('discord.js')
const Client = new Client()
const { Verifier } = require('discord-verifier')
const verifiers = [
    new Verifier({
        channel:'123456789012345678',
        role:'Verified',
        agreeMessage:'I agree',
    }),
    new Verifier({
        channel:'123456789012345671'
        //role can be omitted, default to 'Member'
        //agreeMessage can also be omitted,defult to 'agree'
    })
]
client.on('message',message => {
    verifiers.forEach(v => v.run(message))
})
client.login('xxxxxxxxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxx.xxxxxx')
```

## Documentation

### Classes

#### Verifier extends [EventEmitter](https://nodejs.org/api/events.html)

A verifier

##### Properties

###### .count

No. of verified members

###### .channel

ID of the verification channel

###### .role

Name of the verified role

###### .agreeMessage

The message that will trigger the verifier

##### Methods

###### run(message) 

Run the verifier, accpet a discord.js message object  as a parameter.

###### pause()

Stop the verifier (disable run())

###### resume()

Resume the verifier (enable run())

#### Events

###### Verified

Emitted when a member is verified

Parameter : The verified member



