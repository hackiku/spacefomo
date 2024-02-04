<script>
    import { writable } from 'svelte/store';
    import MirrorSpecs from '$lib/MirrorSpecs.svelte';
    import { diameter, curvature, altitude, mirrorArea, calculatedFocalPointSize, calculatedMirrorDiameter } from '$lib/MirrorSpecs.svelte';

    // Writable stores for variable values
    const orbitalAltitude = writable(2000);
    const temperature = writable(1000);

</script>

<div class="bg-gray-900 p-6 m-32 rounded-xl text-white">
    <h1 class="text-3xl font-bold mb-6">Lunar Death Ray Orbiter Model</h1>

    <!-- Orbit Section -->
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
        <label for="orbitalAltitudeSlider" class="block text-lg mb-2">Orbital Altitude (meters):</label>
        <input 
            id="orbitalAltitudeSlider" 
            type="range" 
            min="0" 
            max="300000" 
            bind:value={$orbitalAltitude}
            class="slider w-full" />
        <p class="text-lg mt-2">Current Altitude: {$orbitalAltitude} meters</p>
    </div>

    <!-- Mirror Section -->
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
    <MirrorSpecs 
        bind:diameter={$diameter} 
        bind:curvature={$curvature} 
        bind:altitude={$altitude} 
    />  
    </div>

    <!-- Temperature Section -->
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
        <label for="temperature" class="block text-lg mb-2">Temperature at Focal Point (K):</label>
        <input 
            id="temperature" 
            type="number" 
            class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500" 
            readonly />
    </div>
</div>