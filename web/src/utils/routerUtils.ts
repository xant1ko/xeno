export function pushAddressWithHistoryCheck (router: any, routerTarget: string, expectingRoute: string | null): void {
  let expectingRouteToSearch = expectingRoute
  if (!expectingRouteToSearch) {
    expectingRouteToSearch = routerTarget
  }
  const historyBack = router.options.history.state.back
  if (historyBack && historyBack.includes(expectingRouteToSearch)) {
    router.push(historyBack)
  } else {
    router.push(routerTarget)
  }
}
