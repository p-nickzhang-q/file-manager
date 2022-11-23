const CustomComponent = (props: any, context: any) => {
    const {element, attrs, ...others} = props;

    function composeOptions() {
        return attrs.__slot__.options.map(({label, value}: any) => {
            return h(resolveComponent('el-option'), {label, value})
        });
    }

    let func = () => null;
    if (attrs?.__slot__?.options) {
        func = composeOptions;
    }
    // if (attrs?.__vModel__ === 'field104') {
    // }
    // @ts-ignore
    return h(resolveComponent(element), {...attrs, ...others,}, context.slots.default ?? func())
}

CustomComponent.props = ['element', 'attrs']

export default CustomComponent
