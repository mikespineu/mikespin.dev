import useConfigurationState, {
  Finish,
} from '@/components/displate/state/configurationState'

const ConfiguratorPanel = () => {
  const { finish, updateFinish } = useConfigurationState((state) => state)
  return (
    <aside className="flex flex-col absolute top-0 md:right-16 w-full md:w-[440px] h-full pt-16 justify-end md:justify-center pointer-events-none">
      <div className="bg-white md:rounded-2xl p-4 align-middle shadow-lg pointer-events-auto">
        <h1 className="text-2xl font-bold pb-2">ELDEN RING key art {finish}</h1>
        <p className="text-sm pb-4">ELDEN RING Official Brand Shop</p>
        <label
          htmlFor="finish"
          onClick={() => updateFinish(finish ? Finish.Matte : Finish.Gloss)}
          className="rounded-full text-sm cursor-pointer relative rounded-2xl flex h-9 outline-none focus:outline-none"
        >
          <input
            name="finish"
            type="checkbox"
            className="hidden focus:outline-none"
          />
          <span className="bg-gray-200 px-4 py-2 relative z-0 rounded-l-2xl text-center inline-block w-[80px]">
            Matte
          </span>
          <span className="bg-gray-200 px-4 py-2 relative z-0 rounded-r-2xl text-center inline-block w-[80px]">
            Gloss
          </span>
          <span
            className={`px-4 py-2 absolute bg-blue-600 rounded-2xl text-white transition ease-in-out  w-[80px] left-0 text-center ${
              finish === 0 ? 'translate-x-0' : 'translate-x-full'
            } z-1`}
          >
            {finish === 0 ? 'Matte' : 'Gloss'}
          </span>
        </label>
      </div>
    </aside>
  )
}

export default ConfiguratorPanel
