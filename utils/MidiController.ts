interface MIDIInput {
  onmidimessage: (event: MIDIMessageEvent) => void
}

type MIDIInputs = Map<string, MIDIInput>

interface MIDIAccess {
  inputs: MIDIInputs
}

class MIDIController {
  constructor() {
    // Bind `this` do metod, aby zapewnić poprawne odniesienia w callbackach
    this.onMIDIMessage = this.onMIDIMessage.bind(this)
  }

  // Metoda inicjująca dostęp do MIDI
  public initialize(): void {
    console.log('elo')
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess()
        .then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this))
    } else {
      console.log('Web MIDI API is not available in your browser.')
    }
  }

  // Callback po pomyślnym uzyskaniu dostępu do MIDI
  private onMIDISuccess(midiAccess: MIDIAccess): void {
    midiAccess.inputs.forEach((input) => {
      input.onmidimessage = this.onMIDIMessage
    })
  }

  // Callback w przypadku błędu dostępu do MIDI
  private onMIDIFailure(): void {
    console.log('Could not access your MIDI devices.')
  }

  // Handler dla przychodzących wiadomości MIDI
  private onMIDIMessage(message: MIDIMessageEvent): void {
    const data = message.data
    const command = data[0]
    const note = data[1]
    const velocity = data[2]
    // console.log(`Command: ${command}`)

    // knobs
    if (command === 176) {
      // CC message
      this.handleControlChange(note, velocity)
    }
    // key down
    if (command === 128) {
      console.log('key down', note)
    }
    if (command === 144) {
      console.log('key up', note)
    }
  }

  // Metoda do obsługi zmian kontrolnych
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  private handleControlChange(controlNumber: number, value: number): void {}

  public setupCallback(
    callback: (controlNumber: number, value: number) => void
  ): void {
    this.handleControlChange = callback
  }
}

export default MIDIController
