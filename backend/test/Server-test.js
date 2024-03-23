import { expect } from 'chai';

describe('Product', () => {
    it('should return the correct product name', () => {
        const product = {
            name: 'iPhone 12',
            price: 999,
            quantity: 10
        };

        expect(product.name).to.equal('iPhone 12');
    });
});
