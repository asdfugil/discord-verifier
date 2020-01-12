import { EventEmitter } from 'events'
import { GuildMember, Message, Snowflake, Client } from 'discord.js'
/**Options for message verifiers*/
type MessageVerifierOptions = {
    /**Name of the verified role */
    role?: string
    /**Content of the message that will trigger the verifier */
    agreeMessage?: string
    /**ID of the verification channel */
    channelID: Snowflake
}
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
/**A packet emitted by the 'raw' client event */
type packet = {
    t: string
    s: number
    op: number
    d: {
        user_id: Snowflake
        message_id: Snowflake
        emoji: {
            name: string
            id: Snowflake | null
            animated: boolean
        }
        channel_id: Snowflake
        guild_id: Snowflake | null
    } | any
}
declare module 'discord-verifier' {
    /**
     * @constructor A message verifier
     * @param { MessageVerifierOptions } options - Options for the verifier
     */
    class MessageVerifier extends EventEmitter {
        constructor(messageVerifierOptions: MessageVerifierOptions)
        /**Number of members that have verified */
        count: number
        /**Content of the agree message */
        agreeMessage: string
        /**ID of the #verify channel */
        channelID: Snowflake
        /**Name of the verified role */
        role: string
        /**If this verifier is enabled*/
        enabled:boolean
        /**Emitted when a member is verified */
        public on(event: 'Verified', listener: (member: GuildMember) => void): this
        /**Run the verifier */
        run(message: Message): void
        /** Pause the verifier, run() is disabled*/
        pause(): this
        /**Enable the verifier, run() is enabled*/
        enable(): this
    }
    class ReactionVerifier extends EventEmitter {
        constructor(reactionVerifierOptions:ReactionVerifierOptions)
        /**Number of members that have verified */
        count: number
        /**The agree unicode emoji */
        agreeEmoji: string
        /**ID of the verify channel */
        channelID: Snowflake
        /**ID of the message of the verify reactions */
        messageID:Snowflake
        /**Name of the verified role */
        role: string
        /**If this verifier is enabled*/
        enabled:boolean
        /**Emitted when a member is verified */
        public on(event: 'Verified', listener: (member: GuildMember) => void): this
        /**Run the verifier */
        run(packet: packet, client: Client): this
        /** Pause the verifier, run() is disabled*/
        pause(): this
        /**Enable the verifier, run() is enabled*/
        enable(): this
    }
}