// effects/cursor.ts
import { Effect } from 'postprocessing'
import { Uniform } from 'three'
import fragmentShader from './cursor.frag?raw'

export class CursorEffect extends Effect {
  constructor() {
    super('CursorEffect', fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ['uTrailMask', new Uniform(null)],
        ['uTime', new Uniform(0)]
      ])
    })
  }
}