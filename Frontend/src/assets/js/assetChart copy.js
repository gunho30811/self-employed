import axios from 'axios';

// assets/js/assetChart.js

const id = '1234';

// 도넛 차트 데이터
export let asset_data_doughnut = {
  // 여기서 export 추가
  labels: [],
  datasets: [
    {
      backgroundColor: [
        '#4A90E2',
        '#F5A623',
        '#F8E71C',
        '#7ED321',
        '#9B9B9B',
        '#BD10E0',
        '#9013FE',
      ],
      data: [], // 예시 데이터; 필요에 따라 수정 가능
    },
  ],
};

// 도넛 차트 옵션
export const asset_doughnutoptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'right',
      labels: {
        boxWidth: 8,
        padding: 10,
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: 14,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          const dataset = tooltipItem.dataset;
          const currentValue = dataset.data[tooltipItem.dataIndex];
          const total = dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((currentValue / total) * 100).toFixed(2);
          return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
        },
      },
    },
    datalabels: {
      formatter: (value, ctx) => {
        const dataset = ctx.chart.data.datasets[0];
        const total = dataset.data.reduce((acc, val) => acc + val, 0);
        const percentage = ((value / total) * 100).toFixed(2);
        return `${percentage}%`; // 데이터와 퍼센트 함께 표시
      },
      color: '#000', // 글자 색상
      font: {
        weight: '',
        size: 12, // 글자 크기
      },
      anchor: '', // 중앙에 위치
      align: 'center', // 중앙 정렬
    },
  },
};

// 혼합 차트 데이터
export let mixed_data = {
  labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4'], // 라벨 설정
  datasets: [
    {
      type: 'bar',
      label: '일주일 전 판매량',
      data: [10, 20, 30, 30],
      borderColor: 'rgb(255, 9, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
    },
    {
      type: 'line', // 첫 번째 라인 데이터셋
      label: '금일 판매량',
      data: [10, 20, 22, 30],
      fill: false,
      borderColor: 'rgb(54, 162, 235)',
      tension: 0.1, // 선의 곡률 조정
    },
  ],
};

// 혼합 차트 옵션
export const mixed_options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// 데이터 가져오는 함수
export async function fetchChartData(loanRepaymentStatus) {
  const response = await axios.get(`/api/kmap/member/${id}`);
  const dongname = response.data.dongname;

  const doughnut = await axios.get(`/api/chart/doughnut`);

  const sortedData = doughnut.data.sort((a, b) => b.amount - a.amount);

  asset_data_doughnut.labels = sortedData.map(
    (item) => `${item.categoryName}: ${item.amount.toLocaleString()}원`
  );
  asset_data_doughnut.datasets[0].data = sortedData.map((item) => item.amount);

  loanRepaymentStatus.value = sortedData
    .reduce((acc, item) => acc + item.amount, 0)
    .toLocaleString();

  const mixchart = await axios.get(`/api/chart/mixchart`);

  const firstData = [];
  const secondData = [];

  const categorizedData = mixchart.data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    if (acc[item.category].length === 0) {
      acc[item.category].push(item);
      firstData.push(item); // 첫 번째 데이터를 firstData에 추가
    } else if (acc[item.category].length === 1) {
      acc[item.category].push(item);
      secondData.push(item); // 두 번째 데이터를 secondData에 추가
    }
    return acc;
  }, {});

  const firstAndSecondData = Object.values(categorizedData).flat();

  mixed_data.labels = firstData.map((item) => item.categoryName);

  mixed_data.datasets[0].data = firstData.map((item) => item.amount);
  mixed_data.datasets[1].data = secondData.map((item) => item.amount);
}