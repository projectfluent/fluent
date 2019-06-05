export default function walk(node, visitor, state) {
    function cont(node, state) {
        let visit = visitor[node.type];
        if (visit) {
            return visit(node, state, cont);
        }
    }

    return cont(node, state);
}
