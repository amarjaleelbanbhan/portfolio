/**
 * One decorative widget must not be able to take a page down.
 *
 * This existed inside SceneCanvas and covered only the React Three Fiber
 * scenes. The hand-rolled Three.js cube had nothing, so on a browser with WebGL
 * disabled it threw out of an effect and the whole of /skills rendered blank —
 * no heading, no galaxy, no links, on a page whose actual content is plain DOM
 * and never needed WebGL at all.
 *
 * Wrap anything that talks to a GPU, a physics engine or a canvas. `fallback`
 * is what a visitor sees instead; null is fine for something purely ambient,
 * but a visible widget should hand over something that says what was there.
 */
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // Surfaced for debugging; the visitor just sees the fallback.
    console.error(`[${this.props.label ?? 'ErrorBoundary'}] failed, showing fallback:`, error);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
