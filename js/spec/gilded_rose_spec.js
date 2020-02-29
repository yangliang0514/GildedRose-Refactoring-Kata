describe("Gilded Rose", function() {
  var expectNameNotChanged = (name) => {
    it("does not change the name", () => {
      var items = [ new Item(name, 0, 0) ];
      update_quality(items);
      expect(items[0].name).toEqual(name);
    });
  }

  var expectSellInBehaviour = (itemName) => {
    it("lowers sell in value by 1 at the end of the day", () => {
      var items = [ new Item(itemName, 1, 0) ];
      update_quality(items);
      expect(items[0].sell_in).toEqual(0);
    });

    it("lowers sell in value by N after N days", () => {
      var n = 10
      var items = [ new Item(itemName, n, 0) ];

      for (n; n > 0; n--) {
        update_quality(items);
        expect(items[0].sell_in).toEqual(n-1);
      }
      expect(items[0].sell_in).toEqual(0);
    });

    it("sell in value can be negative", () => {
      var items = [ new Item(itemName, 0, 0) ];
      update_quality(items);
      expect(items[0].sell_in).toEqual(-1);
    });
  }

  var expectQualityRange = (itemName) => {
    it('quality value is never negative', () => {
      var items = [ new Item(itemName, 0, 0) ];
      update_quality(items);
      expect(items[0].quality).toBeGreaterThanOrEqual(0);
    });

    it('quality value is never more than 50', () => {
      var items = [ new Item(itemName, 20, 50) ];
      update_quality(items);
      expect(items[0].quality).toBeLessThanOrEqual(50);
    });
  }

  describe('Default item "foo"', () => {
    var name = 'foo';
    expectNameNotChanged(name);
    expectSellInBehaviour(name);

    describe('item quality', () => {
      expectQualityRange(name);

      describe('when sell in date not passed yet', () => {
        it('lowers quality value by 1 at the end of the day', () => {
          var items = [ new Item(name, 1, 1) ];
          update_quality(items);
          expect(items[0].quality).toEqual(0);
        });

        it('lowers quality value by N after N days', () => {
          var n = 10;
          var items = [ new Item(name, n, n) ];

          for (n; n > 0; n--) {
            update_quality(items);
            expect(items[0].quality).toEqual(n-1);
          }
          expect(items[0].quality).toEqual(0);
        });
      });

      describe('when sell in date has passed', () => {
        it('lowers quality value by 2 at the end of the day', () => {
          var items = [ new Item(name, 0, 4) ];
          update_quality(items);
          expect(items[0].quality).toEqual(2);
        });

        it('lowers quality value twice as fast after N days', () => {
          var n = 5;
          var quality = 15;
          var items = [ new Item(name, 0, quality) ];

          for (var i = 1; i <= n; i++) {
            update_quality(items);
            expect(items[0].quality).toEqual(quality - 2*i);
          }
          expect(items[0].quality).toEqual(quality - 2*n);
        });
      });
    });
  });

  describe('Aged Brie', () => {
    var name = 'Aged Brie';
    expectNameNotChanged(name);
    expectSellInBehaviour(name);

    describe('item quality', () => {
      expectQualityRange(name);

      describe('when sell in date not passed yet', () => {
        it('increases by 1 the older it gets', () => {
          var n = 5;
          var items = [ new Item(name, n, 0) ];

          for (var i = 1; i <= n; i++) {
            update_quality(items);
            expect(items[0].quality).toEqual(i);
          }
          expect(items[0].quality).toEqual(n);
        });
      });

      describe('when sell in date has passed', () => {
        it('increases twice as fast the older it gets', () => {
          var n = 5;
          var items = [ new Item(name, 0, 0) ];

          for (var i = 1; i <= n; i++) {
            update_quality(items);
            expect(items[0].quality).toEqual(2*i);
          }
          expect(items[0].quality).toEqual(2*n);
        });
      });

      it('is never more than 50', () => {
        var items = [ new Item(name, 0, 49) ];
        update_quality(items);
        expect(items[0].quality).toEqual(50);
      });
    });
  });

  describe('Sulfuras, Hand of Ragnaros', () => {
    var name = 'Sulfuras, Hand of Ragnaros';
    expectNameNotChanged(name);

    it('does not change the sell in', () => {
      var items = [ new Item(name, 1, 0) ];
      update_quality(items);
      expect(items[0].sell_in).toEqual(1);
    });

    describe('item quality', () => {
      expectQualityRange(name);

      describe('when sell in date not passed yet', () => {
        it('does not change the quality', () => {
          var items = [ new Item(name, 3, 0) ];
          update_quality(items);
          expect(items[0].quality).toEqual(0);
        });
      });

      describe('when sell in date has passed', () => {
          var items = [ new Item(name, -1, 0) ];
          update_quality(items);
          expect(items[0].quality).toEqual(0);
      });
    });
  });

  describe('Backstage passes to a TAFKAL80ETC concert', () => {
    var name = 'Backstage passes to a TAFKAL80ETC concert';
    expectNameNotChanged(name);
    expectSellInBehaviour(name);

    describe('item quality', () => {
      expectQualityRange(name);

      describe('when sell in date not passed yet', () => {
        describe('when sell in above 10 days', () => {
          it('increases by 1 the older it gets', () => {
            var n = 5;
            var items = [ new Item(name, 20, 0) ];

            for (var i = 1; i <= n; i++) {
              update_quality(items);
              expect(items[0].quality).toEqual(i);
            }
            expect(items[0].quality).toEqual(n);
          });;

          it('increases to 50 when sell_in above 10 and quality is 49', () => {
            var items = [ new Item(name, 15, 49) ];
            update_quality(items);
            expect(items[0].quality).toEqual(50);
          });

          it('increases to 50 instead of 51 when sell_in at least 5 and quality is 49', () => {
            var items = [ new Item(name, 5, 49) ];
            update_quality(items);
            expect(items[0].quality).toEqual(50);
          });
        });

        describe('when sell in 10 days or less and above 5 days', () => {
          it('increases by 2 the older it gets', () => {
            var n = 5;
            var quality = 1
            var items = [ new Item(name, 10, quality) ];

            for (var i = 1; i <= n; i++) {
              update_quality(items);
              expect(items[0].quality).toEqual(quality + 2*i);
            }
            expect(items[0].quality).toEqual(quality + 2*n);
          });

          it('increases to 50 instead of 51 when sell_in at least 1 and quality is 49', () => {
            var items = [ new Item(name, 10, 49) ];
            update_quality(items);
            expect(items[0].quality).toEqual(50)
          });
        });

        describe('when sell in 5 days or less', () => {
          it('increases by 3 the older it gets', () => {
            var n = 5;
            var quality = 1
            var items = [ new Item(name, 5, quality) ];

            for (var i = 1; i <= n; i++) {
              update_quality(items);
              expect(items[0].quality).toEqual(quality + 3*i);
            }
            expect(items[0].quality).toEqual(quality + 3*n);
          });

          it('increases to 50 instead of 52 when sell_in at least 1 and quality is 49', () => {
            var items = [ new Item(name, 5, 49) ];
            update_quality(items);
            expect(items[0].quality).toEqual(50)
          });
        });
      });

      describe('when sell in date has passed', () => {
        it('drops to 0 after the concert', () => {
          var items = [ new Item(name, 0, 5) ];
          update_quality(items);
          expect(items[0].quality).toEqual(0)
        });
      });
    });
  });

  describe('Conjured Mana Cake', () => {
    var name = 'Conjured Mana Cake';
    expectNameNotChanged(name);
    expectSellInBehaviour(name);

    describe('item quality', () => {
      expectQualityRange(name);

      //  This is a new feature not yet implemented in gilded rose
      //  use xit() to skip those tests
      //  change to it() to run those tests

      xit('lowers quality value by 2 at the end of the day', () => {
        var items = [ new Item(name, 1, 5) ];
        update_quality(items);
        expect(items[0].quality).toEqual(3)
      });

      xit('lowers quality value twice as fast after N days', () => {
        var quality = 15;
        var items = [ new Item(name, 1, quality) ];

        update_quality(items);
        expect(items[0].quality).toEqual(13)

        update_quality(items);
        expect(items[0].quality).toEqual(9)

        update_quality(items);
        expect(items[0].quality).toEqual(5)

        update_quality(items);
        expect(items[0].quality).toEqual(1)

        update_quality(items);
        expect(items[0].quality).toEqual(0)
      });
    });
  });
});
