import { EventEmitter } from 'events'
import { GuildMember, Message } from 'discord.js'
type VerifierOptions = {
    role?: string
    agreeMessage?: string
    channel: string
}
declare module 'discord-verifier' {
    /**
     * @constructor A verifier
     * @param { VerifierOptions } options - Options for the verifier
     */
    class Verifier extends EventEmitter {
        constructor(options: VerifierOptions)
        /**Number of members that have verified */
        count: number
        /**Content of the agree message */
        agreeMessage: string
        /**ID of the #verify channel */
        channel: string
        /**Name of the verified role */
        role: string
        /**Emitted when a member is verified */
        public on(event: 'Verified', listener: (member: GuildMember) => void): this
        /**Run the verifier */
        run(message: Message): void
        /** Pause the verifier, run() is disabled*/
        pause(): this
        /**Enable the verifier, run() is enabled*/
        enable(): this
    }
}