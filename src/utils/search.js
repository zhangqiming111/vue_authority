/** 按关键字过滤列表数据 */
export function filterByKeyword(list, keyword) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return list;

  return list.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(normalized)
    )
  );
}

/** 按关键字过滤树形数据（保留匹配节点及其父链） */
export function filterTreeByKeyword(tree, keyword, fields = ['title', 'path', 'name']) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return tree;

  const walk = (nodes) => nodes.reduce((result, node) => {
    const children = node.children ? walk(node.children) : [];
    const matched = fields.some((field) =>
      String(node[field] ?? '').toLowerCase().includes(normalized)
    );

    if (matched || children.length) {
      result.push({
        ...node,
        children: children.length ? children : node.children,
      });
    }
    return result;
  }, []);

  return walk(tree);
}
