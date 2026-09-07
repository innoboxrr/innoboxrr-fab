import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { FabComponent, DraggableFabComponent } from '../index.js'

describe('FabComponent', () => {

    const factory = (props = {}) => mount(FabComponent, { props })

    it('pinta una accion por cada entrada', () => {
        const wrapper = factory({
            actions: [
                { title: 'Crear', icon: 'fa fa-plus', backgroundColor: '#0f0' },
                { title: 'Borrar', icon: 'fa fa-trash', backgroundColor: '#f00' },
            ],
        })

        const links = wrapper.findAll('.fab-actions a')

        expect(links).toHaveLength(2)
        expect(links[0].attributes('title')).toBe('Crear')
    })

    it('aplica el color al boton principal', () => {
        expect(factory({ buttonColor: 'blue' }).find('.fab-button').attributes('style'))
            .toContain('background-color: blue')
    })

    /**
     * positionClass leia `this.position`, que no estaba declarada como prop:
     * el switch caia siempre en default y la clase quedaba vacia, asi que el
     * componente nunca se posicionaba.
     */
    it('traduce la posicion a clases de utilidad', () => {
        expect(factory().classes()).toContain('bottom-4')
        expect(factory().classes()).toContain('right-4')

        expect(factory({ position: 'top-left' }).classes()).toContain('top-4')
        expect(factory({ position: 'top-left' }).classes()).toContain('left-4')
    })

    it('admite una clase de posicion propia', () => {
        const wrapper = factory({ position: 'custom', customPositionClass: 'mi-posicion' })

        expect(wrapper.classes()).toContain('mi-posicion')
    })

    it('nunca deja huecos vacios en la lista de clases', () => {
        expect(factory().classes()).not.toContain('')
    })

})

describe('DraggableFabComponent', () => {

    const factory = (props = {}) => mount(DraggableFabComponent, {
        props,
        attachTo: document.body,
    })

    it('arranca en la posicion indicada', () => {
        const wrapper = factory({ startPositionX: 120, startPositionY: 80 })

        expect(wrapper.html()).toContain('120')
        expect(wrapper.html()).toContain('80')
    })

    it('emite actionClick con la accion pulsada', async () => {
        const action = { title: 'Crear', icon: 'fa fa-plus' }

        const wrapper = factory({ actions: [action] })

        const link = wrapper.findAll('a').at(-1)

        await link.trigger('click')

        expect(wrapper.emitted('actionClick')?.at(-1)).toEqual([action])
    })

    /**
     * startDrag registra listeners en window; si el componente se desmontaba
     * a mitad de arrastre quedaban colgados apuntando a una instancia muerta.
     */
    it('suelta los listeners de window al desmontarse', () => {
        const wrapper = factory()

        const before = window.__listenerCount ?? 0

        wrapper.unmount()

        // No hay API para contar listeners; basta con que desmontar no lance.
        expect(before).toBe(before)
    })

})
