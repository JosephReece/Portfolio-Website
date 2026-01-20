import { Effect } from 'postprocessing'
import { Uniform, Vector2 } from 'three'
import fragmentShader from './glass.frag?raw'

export class GlassEffect extends Effect {
  constructor() {
    super('GlassEffect', fragmentShader, {
      // Explicitly typing the Map to allow different Uniform types
      uniforms: new Map<string, Uniform<any>>([
        ['uCursor', new Uniform(new Vector2(0.5, 0.5))],
        ['uRadius', new Uniform(0.15)]
      ])
    })
  }
}