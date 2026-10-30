// THREE.Clock was deprecated in r168 but @react-three/fiber 9.x still uses it internally.
// Filter that specific warning until fiber upgrades to THREE.Timer.
if (typeof window !== 'undefined') {
  const _warn = console.warn.bind(console)
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].startsWith('THREE.Clock:')) return
    _warn(...args)
  }
}
