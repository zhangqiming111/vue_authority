/** 按后端授权路由过滤前端菜单树 */
export function filterMenuByRoutes(menuList, authorizedRoutes) {
  return menuList.reduce((result, item) => {
    const authorized = authorizedRoutes.some(
      (route) => route.name === item.name || !item.name
    );
    if (!authorized) return result;

    const menuItem = { ...item };
    if (item.children) {
      menuItem.routes = filterMenuByRoutes(item.children, authorizedRoutes);
    }
    result.push(menuItem);
    return result;
  }, []);
}

/** 扁平化树节点 ID（含半选父节点） */
export function collectCheckedTreeIds(treeRef) {
  const parentIds = treeRef.getHalfCheckedKeys();
  const childIds = treeRef.getCheckedKeys();
  return parentIds.concat(childIds);
}
