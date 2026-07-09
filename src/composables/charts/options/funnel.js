export const funnelOption = {
  series: [
    {
      name: 'Funnel',
      type: 'funnel',
      left: '10%',
      top: 60,
      bottom: 60,
      width: '80%',
      min: 0,
      max: 100,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: { show: true, position: 'inside' },
      labelLine: { length: 10, lineStyle: { width: 1, type: 'solid' } },
      itemStyle: { borderColor: '#fff', borderWidth: 1 },
      emphasis: { label: { fontSize: 20 } },
      data: [
        { value: 60, name: '1' },
        { value: 40, name: '2' },
        { value: 20, name: '3' },
        { value: 80, name: '4' },
        { value: 100, name: '5' },
      ],
    },
  ],
};
