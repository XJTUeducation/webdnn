'use strict';

var $M, $Mg;
var runner;

function run_entry() {
  run().then(() => {
    console.log('run finished');
  }).catch((error) => {
    console.error('run failed ' + error);
  });
}

async function run() {
  if (!$M) {
    await init();
  }

  let pipeline_data = JSON.parse($('#dnn_pipeline').val());
  runner = new $M.DNNDescriptorRunner(pipeline_data, $Mg.webgpuHandler);
  await runner.compile();

  runner.loadWeights(await fetchWeights('./weight.bin'));

  let input_mat = new Float32Array([1.0, 1.0, 1.0]);
  let output_mats = await runner.run([input_mat]);
  console.log(output_mats[0]);
}

async function init() {
  $M = WebDNN;
  let backend = await $M.init();
  console.log(`backend: ${backend}`);
  $Mg = $M.gpu;
}

async function fetchWeights(path) {
  let response = await fetch(path);
  let ab = await response.arrayBuffer();
  let weights_data = new Float32Array(ab);

  return weights_data;
}
