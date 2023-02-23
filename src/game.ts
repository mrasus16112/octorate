import {Game, Types} from 'phaser';
import * as scene from './scenes/board';

const config: Types.Core.GameConfig = {
  title: "board",
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  type: Phaser.AUTO,
  scene: scene.BoardScene,
  autoFocus: true
};

const game = new Game(config);
