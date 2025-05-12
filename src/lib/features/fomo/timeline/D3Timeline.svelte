<!-- src/lib/features/fomo/timeline/D3Timeline.svelte -->
<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import * as d3 from 'd3';
  import { type DateValue } from "@internationalized/date";
  
  // Props for component configuration
  let { 
    data = [], 
    startDate = null, 
    endDate = null,
    height = 120,
    mode = 'daily'
  } = $props<{
    data: Array<{ date: Date | string, score: number }>;
    startDate?: DateValue | Date | null;
    endDate?: DateValue | Date | null;
    height?: number;
    mode?: 'daily' | 'weekly' | 'monthly';
  }>();
  
  // Create event dispatcher
  const dispatch = createEventDispatcher<{
    rangeSelected: { start: Date, end: Date };
    dateSelected: { date: Date };
  }>();
  
  // Reference to the container element
  let container: HTMLDivElement;
  
  // Reference to the timeline instance
  let timeline: any = null;
  
  // Track window resize for responsive behavior
  let windowWidth = $state(0);
  
  // Process data for visualization
  const processedData = $derived(() => {
    if (!data || data.length === 0) return generateDemoData();
    
    return data.map(item => ({
      date: item.date instanceof Date ? item.date : new Date(item.date),
      score: item.score
    }));
  });
  
  // Selected date range
  let selectedRange = $derived(() => {
    if (startDate && endDate) {
      const start = startDate instanceof Date ? startDate : new Date(startDate.toString());
      const end = endDate instanceof Date ? endDate : new Date(endDate.toString());
      return [start, end];
    }
    return null;
  });
  
  // Create and update the timeline on mount and when relevant properties change
  $effect(() => {
    if (container && processedData.length > 0) {
      if (!timeline) {
        // Create new timeline
        timeline = createFomoTimeline(container, processedData, {
          height,
          selectedRange,
          onRangeSelected: handleRangeSelected
        });
      } else {
        // Update existing timeline
        timeline.update(processedData);
        if (selectedRange) {
          timeline.setRange(selectedRange);
        }
      }
    }
  });
  
  // Update on window resize
  $effect(() => {
    if (windowWidth > 0 && timeline) {
      // Recreate timeline with new dimensions
      timeline = createFomoTimeline(container, processedData, {
        height,
        selectedRange,
        onRangeSelected: handleRangeSelected
      });
    }
  });
  
  // Handle selection
  function handleRangeSelected(selection: Date | [Date, Date]) {
    if (Array.isArray(selection)) {
      // Range selection
      dispatch('rangeSelected', { start: selection[0], end: selection[1] });
    } else {
      // Single date selection
      dispatch('dateSelected', { date: selection });
    }
  }
  
  // Generate demo data if none provided
  function generateDemoData() {
    const now = new Date();
    const demoData = [];
    
    // Generate 90 days of data
    for (let i = 90; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      demoData.push({
        date,
        score: Math.floor(Math.random() * 90) + 10
      });
    }
    
    return demoData;
  }
  
  // Handle window resize
  onMount(() => {
    const handleResize = () => {
      windowWidth = window.innerWidth;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // Helper function to create the D3 timeline
  function createFomoTimeline(container, data, options = {}) {
    // Clear any existing visualization
    d3.select(container).selectAll("svg").remove();

    const {
      width = container.clientWidth,
      height = 120,
      margin = { top: 10, right: 20, bottom: 30, left: 20 },
      barPadding = 1,
      barWidth = 3,
      selectedRange = null,
      onRangeSelected = () => {}
    } = options;

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Create scales
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.score)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .attr('class', 'x-axis')
      .call(d3.axisBottom(x)
        .ticks(5)
        .tickFormat(d3.timeFormat('%b %d')))
      .call(g => g.selectAll('.domain').attr('stroke', 'var(--border)'))
      .call(g => g.selectAll('.tick line').attr('stroke', 'var(--border)'))
      .call(g => g.selectAll('.tick text').attr('fill', 'var(--muted-foreground)').attr('font-size', '10px'));

    // Create group for bars
    const barsGroup = svg.append('g');

    // Add gradient defs
    const defs = svg.append('defs');
    
    // Gradient definitions
    const gradients = [
      { id: 'bar-gradient-high', stopColors: ['var(--venus-yellow)', 'var(--venus-orange)'], opacity: [0.6, 0.6] },
      { id: 'bar-gradient-medium-high', stopColors: ['var(--venus-yellow)', 'var(--venus-orange)'], opacity: [0.6, 0.6] },
      { id: 'bar-gradient-medium', stopColors: ['var(--venus-orange)', 'var(--venus-rust)'], opacity: [0.6, 0.6] },
      { id: 'bar-gradient-low', stopColors: ['var(--venus-rust)', 'var(--venus-rust)'], opacity: [0.6, 0.6] },
      { id: 'bar-gradient-verylow', stopColors: ['var(--muted-foreground)', 'var(--muted)'], opacity: [0.6, 0.6] },
      // Selected states (full opacity)
      { id: 'bar-gradient-high-selected', stopColors: ['var(--venus-yellow)', 'var(--venus-orange)'], opacity: [1, 1] },
      { id: 'bar-gradient-medium-high-selected', stopColors: ['var(--venus-yellow)', 'var(--venus-orange)'], opacity: [1, 1] },
      { id: 'bar-gradient-medium-selected', stopColors: ['var(--venus-orange)', 'var(--venus-rust)'], opacity: [1, 1] },
      { id: 'bar-gradient-low-selected', stopColors: ['var(--venus-rust)', 'var(--venus-rust)'], opacity: [1, 1] },
      { id: 'bar-gradient-verylow-selected', stopColors: ['var(--muted-foreground)', 'var(--muted)'], opacity: [1, 1] }
    ];
    
    // Create the gradient definitions
    gradients.forEach(gradient => {
      const gradientDef = defs.append('linearGradient')
        .attr('id', gradient.id)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
        
      gradientDef.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', gradient.stopColors[0])
        .attr('stop-opacity', gradient.opacity[0]);
        
      gradientDef.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', gradient.stopColors[1])
        .attr('stop-opacity', gradient.opacity[1]);
    });

    // Add bars
    barsGroup.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(new Date(d.date)) - barWidth/2)
      .attr('width', barWidth)
      .attr('y', d => y(d.score))
      .attr('height', d => height - margin.bottom - y(d.score))
      .attr('fill', d => getBarGradient(d.score))
      .attr('rx', 0) // Use squared corners to match design system
      .attr('data-date', d => d.date)
      .attr('data-score', d => d.score)
      .attr('class', 'timeline-bar')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('fill', d => getBarGradient(d.score, true))
          .attr('stroke', 'var(--foreground)')
          .attr('stroke-width', 0.5);
          
        // Show tooltip
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'timeline-tooltip')
          .style('position', 'absolute')
          .style('background', 'var(--card)')
          .style('color', 'var(--foreground)')
          .style('padding', '8px')
          .style('border-radius', '0px') // Using squared corners
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', 100)
          .style('border', '1px solid var(--border)')
          .style('transform', 'translate(-50%, -100%)')
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 10}px`);
          
        tooltip.html(`
          <div class="font-medium">${new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          <div class="text-primary">FOMO: ${d.score}</div>
        `);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('fill', d => getBarGradient(d.score))
          .attr('stroke', null);
        
        // Remove tooltip
        d3.select('.timeline-tooltip').remove();
      })
      .on('click', function(event, d) {
        const clickedDate = new Date(d.date);
        // Handle click to select date range
        onRangeSelected(clickedDate);
      });

    // Add brush for range selection
    const brush = d3.brushX()
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
      .on('end', brushed);

    svg.append('g')
      .attr('class', 'brush')
      .call(brush);

    // If there's a selected range, update the brush
    if (selectedRange) {
      const [start, end] = selectedRange;
      svg.select('.brush').call(brush.move, [x(start), x(end)]);
    }

    // Brush event handler
    function brushed(event) {
      if (!event.selection) return;
      const [x0, x1] = event.selection;
      const dateRange = [x.invert(x0), x.invert(x1)];
      onRangeSelected(dateRange);
    }

    // Helper function to get gradient based on score
    function getBarGradient(score, isSelected = false) {
      const suffix = isSelected ? '-selected' : '';
      
      if (score >= 80) return `url(#bar-gradient-high${suffix})`;
      if (score >= 60) return `url(#bar-gradient-medium-high${suffix})`;
      if (score >= 40) return `url(#bar-gradient-medium${suffix})`;
      if (score >= 20) return `url(#bar-gradient-low${suffix})`;
      return `url(#bar-gradient-verylow${suffix})`;
    }

    return {
      update(newData) {
        // Update the visualization with new data
        const updatedX = d3.scaleTime()
          .domain(d3.extent(newData, d => new Date(d.date)))
          .range([margin.left, width - margin.right]);

        const updatedY = d3.scaleLinear()
          .domain([0, d3.max(newData, d => d.score)])
          .nice()
          .range([height - margin.bottom, margin.top]);

        // Update X axis
        svg.select('.x-axis')
          .call(d3.axisBottom(updatedX)
            .ticks(5)
            .tickFormat(d3.timeFormat('%b %d')));

        // Update bars
        barsGroup.selectAll('rect')
          .data(newData)
          .join('rect')
          .attr('x', d => updatedX(new Date(d.date)) - barWidth/2)
          .attr('width', barWidth)
          .attr('y', d => updatedY(d.score))
          .attr('height', d => height - margin.bottom - updatedY(d.score))
          .attr('fill', d => getBarGradient(d.score))
          .attr('rx', 0);
      },
      setRange(range) {
        // Set the selected range on the visualization
        if (range) {
          svg.select('.brush').call(brush.move, [x(range[0]), x(range[1])]);
        }
      }
    };
  }
</script>

<div 
  class="fomo-timeline w-full h-full bg-card/30 backdrop-blur-sm border border-border rounded-default overflow-hidden"
  bind:this={container}
>
  {#if !data || data.length === 0}
    <div class="flex justify-center items-center h-full">
      <p class="text-sm text-muted-foreground">Loading timeline data...</p>
    </div>
  {/if}
</div>

<style>
  /* Custom styling for brush */
  :global(.brush .selection) {
    fill: var(--primary-foreground);
    fill-opacity: 0.15;
    stroke: var(--primary);
    stroke-opacity: 0.4;
    stroke-width: 1px;
  }
  
  :global(.brush .handle) {
    fill: var(--primary);
    fill-opacity: 0.4;
  }
</style>