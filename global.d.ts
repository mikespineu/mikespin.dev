declare global {
  interface Navigator {
    requestMIDIAccess(): Promise<MIDIAccess>
  }
  interface MIDIMessageEvent extends Event {
    data: Uint8Array
  }
}

export {}
