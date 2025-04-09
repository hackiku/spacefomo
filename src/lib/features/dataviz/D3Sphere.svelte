<!-- src/lib/features/dataviz/D3Sphere.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  
  // Props with defaults
  let { 
    width = 600,
    height = 600, 
    wireframeColor = 'rgba(168, 139, 250, 0.5)',
    wireframeWidth = 0.5,
    rotationSpeed = 0.003,
    position = 'bottom-right'
  } = $props<{
    width?: number;
    height?: number;
    wireframeColor?: string;
    wireframeWidth?: number;
    rotationSpeed?: number;
    position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
  }>();
  
  // Reactive state
  let mounted = $state(false);
  let rotation = $state(0);
  let container: HTMLDivElement;
  
  // Reactive derivation
  const getPositionClasses = $derived(() => {
    switch (position) {
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-left': return 'top-4 left-4';
      case 'bottom-right':
      default: return 'bottom-20 right-4 sm:bottom-24 sm:right-8';
    }
  });
  
  // Animation state and handlers
  let frameId: number;
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  
  // Create the sphere
  function createSphere() {
    // Remove existing SVG if any
    d3.select(container).select('svg').remove();
    
    // Create new SVG
    svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('overflow', 'visible');
    
    // Add a subtle glow filter
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'coloredBlur');
    
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');
    
    // Create a group for the sphere
    const sphere = svg.append('g')
      .attr('transform', `translate(${width/2},${height/2})`);
    
    // Generate sphere wireframe data - longitude lines
    const longitudes = d3.range(0, 360, 15);
    longitudes.forEach(angle => {
      const points = [];
      for (let i = 0; i <= 180; i += 5) {
        const radians = i * Math.PI / 180;
        const r = Math.min(width, height) / 2 - 10;
        points.push([
          r * Math.sin(radians) * Math.cos(angle * Math.PI / 180),
          r * Math.sin(radians) * Math.sin(angle * Math.PI / 180),
          r * Math.cos(radians)
        ]);
      }
      
      // Create path for longitude
      const line = d3.line<[number, number, number]>()
        .x(d => d[0])
        .y(d => d[2]); // Use z for y to get correct orientation
      
      sphere.append('path')
        .datum(points)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', wireframeColor)
        .attr('stroke-width', wireframeWidth)
        .attr('class', 'longitude-line');
    });
    
    // Generate latitude lines
    const latitudes = d3.range(0, 180, 15);
    latitudes.forEach(lat => {
      const points = [];
      for (let i = 0; i <= 360; i += 5) {
        const radians = i * Math.PI / 180;
        const latRad = lat * Math.PI / 180;
        const r = Math.min(width, height) / 2 - 10;
        points.push([
          r * Math.sin(latRad) * Math.cos(radians),
          r * Math.sin(latRad) * Math.sin(radians),
          r * Math.cos(latRad)
        ]);
      }
      
      // Create path for latitude
      const line = d3.line<[number, number, number]>()
        .x(d => d[0])
        .y(d => d[2]); // Using z for y to get correct orientation
      
      sphere.append('path')
        .datum(points)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', wireframeColor)
        .attr('stroke-width', wireframeWidth)
        .attr('class', 'latitude-line');
    });
    
    // Apply initial rotation
    updateRotation();
  }
  
  // Rotation animation
  function animate() {
    rotation += rotationSpeed;
    updateRotation();
    frameId = requestAnimationFrame(animate);
  }
  
  // Update sphere rotation
  function updateRotation() {
    if (!svg) return;
    
    svg.selectAll('.longitude-line').attr('transform', `rotate(${rotation * 30})`);
    svg.selectAll('.latitude-line').attr('transform', `rotate(${rotation * 15}, 0, 0)`);
  }
  
  // Handle component mounting
  onMount(() => {
    mounted = true;
    createSphere();
    animate();
    
    // Cleanup on destroy
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  });
</script>

<div 
  bind:this={container}
  class="fixed {getPositionClasses} z-40 opacity-60 hover:opacity-90 transition-opacity duration-300" 
  style="pointer-events: none;"
></div>