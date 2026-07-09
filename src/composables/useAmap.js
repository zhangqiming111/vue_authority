import { ref, onMounted, onBeforeUnmount } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import { AMAP_KEY, AMAP_PLUGINS } from '@/constants/amap';
import { notifyError, notifySuccess } from '@/utils/message';

export function useAmap() {
  const keywordInput = ref('');
  const locationSearchStart = ref('');
  const locationSearchEnd = ref('');
  const radioChecked = ref('drivingComponent');

  let map = null;
  let adCode = null;
  let autoCompleteComponent = null;
  let placeSearchComponent = null;
  const routeComponents = {};

  function initMap() {
    AMapLoader.load({ key: AMAP_KEY, version: '2.0', plugins: AMAP_PLUGINS }).then((AMap) => {
      map = new AMap.Map('container', { resizeEnable: true, zoom: 11, viewMode: '3D' });

      const geocoder = new AMap.Geocoder();
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        position: 'RB',
        offset: [10, 20],
        zoomToAccuracy: true,
      });

      map.addControl(geolocation);
      geolocation.getCurrentPosition((status, result) => {
        if (status !== 'complete') return;
        geocoder.getAddress([result.position.lng, result.position.lat], (subStatus, subResult) => {
          if (subStatus === 'complete' && subResult.regeocode) {
            locationSearchStart.value = subResult.regeocode.formattedAddress;
          }
        });
      });

      map.addControl(new AMap.ControlBar({ position: { top: '10px', left: '20px' } }));
      map.addControl(new AMap.ToolBar({ position: { top: '110px', left: '50px' } }));
      map.addControl(new AMap.Scale());
      map.addControl(new AMap.HawkEye({ isOpen: true }));
      map.addControl(new AMap.MapType());

      autoCompleteComponent = new AMap.AutoComplete({ input: 'keywordInput' });
      autoCompleteComponent.on('select', (e) => { adCode = e.poi.adcode; });

      placeSearchComponent = new AMap.PlaceSearch({
        map, pageSize: 5, pageIndex: 1, panel: 'panel', autoFitView: true,
      });

      routeComponents.drivingComponent = new AMap.Driving({ map, panel: 'routePanel' });
      routeComponents.walkingComponent = new AMap.Walking({ map, panel: 'routePanel' });
      routeComponents.RidingComponent = new AMap.Riding({ map, panel: 'routePanel' });
      routeComponents.TransferComponent = new AMap.Transfer({
        map, city: '全国', panel: 'routePanel', policy: AMap.TransferPolicy.LEAST_TIME,
      });
    });
  }

  function keywordSearch() {
    placeSearchComponent?.setCity(adCode);
    placeSearchComponent?.search(keywordInput.value);
  }

  function routeSearch() {
    if (!locationSearchStart.value || !locationSearchEnd.value) {
      notifyError('起始位置 / 结束位置不能为空!');
      return;
    }

    routeComponents[radioChecked.value]?.search(
      [{ keyword: locationSearchStart.value }, { keyword: locationSearchEnd.value }],
      (status) => {
        status === 'complete' ? notifySuccess('最佳路线查找成功') : notifyError('路线查找失败');
      }
    );
  }

  function checkBindVal(value) {
    radioChecked.value = value;
    routeSearch();
  }

  onMounted(initMap);

  onBeforeUnmount(() => {
    map?.destroy();
    map = null;
  });

  return {
    keywordInput,
    locationSearchStart,
    locationSearchEnd,
    radioChecked,
    keywordSearch,
    routeSearch,
    checkBindVal,
  };
}
