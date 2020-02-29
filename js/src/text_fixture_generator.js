var lines = [];
var itemList = [];

itemList.push(new Item('+5 Dexterity Vest', 10, 20));
itemList.push(new Item('Aged Brie', 2, 0));
itemList.push(new Item('Elixir of the Mongoose', 5, 7));
itemList.push(new Item('Sulfuras, Hand of Ragnaros', 0, 80));
itemList.push(new Item('Sulfuras, Hand of Ragnaros', -1, 80));
itemList.push(new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20));
itemList.push(new Item('Backstage passes to a TAFKAL80ETC concert', 10, 49));
itemList.push(new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49));
// this conjured item does not work properly yet
// items.push(new Item('Conjured Mana Cake', 3, 6));

function generate_fixtures(lines, days, items) {
  for(var day = 0; day <= days; day++) {
    lines.push(`-------- day ${day} --------`);
    lines.push('name, sellIn, quality');

    for(var i = 0; i < itemList.length; i++) {
      var item = items[i];
      lines.push(`${item.name}, ${item.sell_in}, ${item.quality}`)
    }

    lines.push('<br />');
    update_quality(items);
  }
}
