import { LitElement, css, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import LiveState, { liveState } from 'phx-live-state'

type ChatMessage = {
  from: string;
  content: string;
}

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('discord-chat')
@liveState({
  channelName: 'discord_chat:new',
  properties: ['messages'],
  events: {
    send: ['new_message', 'start_chat']
  }
})
export class DiscordChatElement extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  url = '';

  /**
   * The number of times the button has been clicked.
   */
  @state()
  messages: Array<ChatMessage> = [];

  @state()
  name: string | undefined;

  liveState: LiveState | undefined;

  @query('input[name="name"]')
  nameInput: HTMLInputElement | undefined;

  @query('input[name="message"]')
  messageInput: HTMLInputElement | undefined;

  render() {
    return this.name ? html`
    <ul>
      ${this.messages.map(message => html`<li>${message.from}: ${message.content}</li>`)}
    </ul>
    <label>Message: <input name="message"></label>
    <button @click=${this.sendMessage}>Send Message</button>
    ` : html `
      <label>Name:<input name="name" /></label>
      <button @click=${this.startChat}>Start Chat</button>
    `;
  }

  startChat() {
    this.dispatchEvent(new CustomEvent('start_chat', {detail: {name: this.nameInput?.value}}))
    this.name = this.nameInput?.value;
    this.nameInput!.value = '';
  }

  sendMessage() {
    this.dispatchEvent(new CustomEvent('new_message', {detail: {message: this.messageInput?.value}}))
    this.messageInput!.value = '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'discord-chat': DiscordChatElement
  }
}
