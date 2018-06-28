import Vue from 'vue';
import StaffSearch from '@/components/StaffSearch';

describe('StaffSearch.vue', () => {
  it('has a created hook', () => {
    expect(typeof StaffSearch.created).toBe('function');
  });
  it('has a mounted hook', () => {
    expect(typeof StaffSearch.mounted).toBe('function');
  });
  it('has child components', () => {
    expect(typeof StaffSearch.components).toBe('object');
  });
  it('should render correct contents', () => {
    const Constructor = Vue.extend(StaffSearch);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.staffSearch label'))
      .toBeTruthy();
  });
});
