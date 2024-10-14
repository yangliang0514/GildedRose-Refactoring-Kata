class GildedRose

  @@item_names = ["Aged Brie", "Backstage passes to a TAFKAL80ETC concert", "Sulfuras, Hand of Ragnaros"]

  def initialize(items)
    @items = items
  end

  def update_quality()
    @items.each do |item|
      if item.name == "Aged Brie"
        item.quality = item.quality + 1 if item.quality < 50
        item.sell_in -= 1

        if item.sell_in < 0 and item.quality < 50
          item.quality += 1
        end
      end
      
      if item.name == "Backstage passes to a TAFKAL80ETC concert"
        item.quality += 1 if item.quality < 50
        item.quality += 1 if item.sell_in < 11 and item.quality < 50
        item.quality += 1 if item.sell_in < 6 and item.quality < 50
        item.sell_in -= 1

        if item.sell_in < 0
          item.quality = 0
        end
      end

      if item.name == "Sulfuras, Hand of Ragnaros"
      end

      if is_others?(item.name)
        item.quality = item.quality > 0 ? item.quality - 1 : item.quality
        item.sell_in -= 1

        if item.sell_in < 0 and item.quality > 0
          item.quality -= 1
        end
      end
    end
  end
  
  private

  def is_others?(item_name)
    not @@item_names.include?(item_name)
  end
end

class Item
  attr_accessor :name, :sell_in, :quality

  def initialize(name, sell_in, quality)
    @name = name
    @sell_in = sell_in
    @quality = quality
  end

  def to_s()
    "#{@name}, #{@sell_in}, #{@quality}"
  end
end
