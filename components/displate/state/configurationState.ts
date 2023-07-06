import { create } from 'zustand'

export enum Finish {
  'Matte',
  'Gloss',
}

type ConfigurationState = {
  finish: Finish
  updateFinish: (finish: Finish) => void
}

const useConfigurationState = create<ConfigurationState>((set) => ({
  finish: Finish.Matte,
  updateFinish: (finish: Finish) => set(() => ({ finish })),
}))

export default useConfigurationState
