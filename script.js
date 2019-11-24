const inpFunc = '(sin(x)+cos(x^2))/7';
const inpRange = document.getElementById("inputRange");
const inpSteps = document.getElementById("inputSteps");
const inpPlot = document.getElementById("inputPlot");

let funcOptions = {
  target: '#plotter',
  width: 1100,
  height: 600,
  grid: true,
  xAxis: {
    label: 'x',
    domain: [-6, 6]
  },
  yAxis: {
    label: 'y'
  },
  data: []
};

functionPlot(funcOptions);

inpPlot.addEventListener("click", () => {
  let func = inpFunc;
  let xRange = [-10, 10];
  let steps = [];
  steps.push(inpSteps.value);
console.log(steps);

  functionPlot(funcOptions);
  funcOptions.data = [
    {
      fn: func,
      range: xRange,
      color: 'black',
    }
  ];

  let [l, r] = xRange;
  let yMax = -Infinity, yMin = Infinity;

  let n = +steps[0];
  let splines = [];
  let h = (r - l) / (n - 1);
  let f = [];
  for (let i = 0; i < n; i++) {
    splines.push({ x: l + i * h });
    f.push(math.evaluate(func, { x: splines[i].x }));
    splines[i].a = f[i];
  }

  let alpha = [0], beta = [0];
  splines[0].c = 0;
  splines[n - 1].c = 0;

  for (let i = 1; i < n - 1; i++) {
    alpha.push(-1 / (4 + alpha[i - 1]));
    beta.push(1 / (4 + alpha[i - 1]) * (6 / (h * h) *
      (f[i + 1] - 2 * f[i] + f[i - 1]) - beta[i - 1]));
  }

  for (let i = n - 2; i > 0; i--) {
    splines[i].c = alpha[i] * splines[i + 1].c + beta[i];
  }

  for (let i = n - 1; i > 0; i--) {
    splines[i].d = (splines[i].c - splines[i - 1].c) / h;
    splines[i].b = h / 2 * splines[i].c - (h * h) / 6 * splines[i].d + (f[i] - f[i - 1]) / h;
  }

  let dots = [], epsilon = (xRange[1] - xRange[0]) / 30000;
  for (let i = 1; i < splines.length; i++) {
    let dx, curVal;
    for (let x = splines[i - 1].x; x <= splines[i].x; x += epsilon) {
      dx = x - splines[i].x;
      curVal = splines[i].a + splines[i].b * dx + splines[i].c / 2 * dx * dx + splines[i].d / 6 * dx * dx * dx;
      dots.push([x, curVal]);
      yMax = Math.max(yMax, curVal);
      yMin = Math.min(yMin, curVal);
    }
  }

  funcOptions.data.push({
    points: dots,
    fnType: 'points',
    graphType: 'polyline',
    color: 'red',
  })

  let xDif = xRange[1] - xRange[0];
  let yDif = yMax - yMin;

  funcOptions.xAxis.domain = [xRange[0] - xDif * 0.1, xRange[1] + xDif * 0.1];
  funcOptions.yAxis.domain = [yMin - yDif * 0.1, yMax + yDif * 0.1];
  funcOptions.title = "f(x) = " + func;

  functionPlot(funcOptions);
});
