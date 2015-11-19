$(() => {
  const drivers = {
    DOM: makeDOMDriver('#app')
  };

  Cycle.run(main, drivers);
});

