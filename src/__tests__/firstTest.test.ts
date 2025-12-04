import '@testing-library/jest-dom';

 function getSum(a: number, b: number) {
    return a + b;
 }


test('Test test', () => {
    expect(getSum(1, 0)).toEqual(1);
});

test('Test test', () => {
    expect(getSum(-1, 50)).toEqual(49);
});


describe('getSum function', () => {
    it('should return 4 if called with 2 and 2', () => {
        expect(getSum(2, 2)).toEqual(4);
    });

     it('should return 0 if called with -2 and 2', () => {
        expect(getSum(-2, 2)).toEqual(0);
    })
})