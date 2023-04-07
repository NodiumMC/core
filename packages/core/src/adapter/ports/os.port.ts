export interface OsPort {
  get name(): 'windows' | 'linux' | 'darwin'
  get arch(): string
  get version(): string
  get isx64(): boolean
}
