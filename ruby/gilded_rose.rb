class GildedRose

  @@special_items = ["Aged Brie", "Backstage passes to a TAFKAL80ETC concert", "Sulfuras, Hand of Ragnaros"]

  def initialize(items)
    @items = items
  end

  # specs:
  #  "Aged Brie":
  #   1. Decrease `sell_in` by 1 each day (on each update).
  #   2. After `sell_in` is decreased:
  #      - Increase `quality` by 1 if `sell_in` >= 0.
  #      - Increase `quality` by 2 if `sell_in` < 0.
  #   
  #  "Backstage passes to a TAFKAL80ETC concert":
  #   1. Decrease `sell_in` by 1 each day (on each update).
  #   2. After `sell_in` is decreased:
  #      - If `sell_in` >= 10: increase `quality` by 1.
  #      - If 5 <= `sell_in` < 10: increase `quality` by 2.
  #      - If 0 <= `sell_in` < 5: increase `quality` by 3.
  #      - If `sell_in` < 0: reset `quality` to 0.
  #     
  #  "Sulfuras, Hand of Ragnaros":
  #   1. No operations on `sell_in` or `quality`.
  #   
  #  Other items:
  #   1. Decrease `sell_in` by 1 each day (on each update).
  #   2. After `sell_in` is decreased:
  #      - Decrease `quality` by 1 if `sell_in` >= 0.
  #      - Decrease `quality` by 2 if `sell_in` < 0.

  def update_quality()
    @items.each do |item|
      if item.name == "Aged Brie"
        decrease_sell_in(item)

        case
        when item.sell_in >= 0
          increase_quality(item)
        when item.sell_in < 0
          increase_quality(item, times: 2)
        end
      end
      
      if item.name == "Backstage passes to a TAFKAL80ETC concert"
        decrease_sell_in(item)

        case 
        when item.sell_in >= 10
          increase_quality(item)
        when item.sell_in < 10 && item.sell_in >= 5
          increase_quality(item, times: 2)
        when item.sell_in < 5 && item.sell_in >= 0
          increase_quality(item, times: 3)
        when item.sell_in < 0
          reset_quality(item)
        end
      end

      if item.name == "Sulfuras, Hand of Ragnaros"
      end

      if is_others?(item.name)
        decrease_sell_in(item)

        case
        when item.sell_in >= 0
          decrease_quality(item)
        when item.sell_in < 0
          decrease_quality(item, times: 2)
        end
      end
    end
  end
  
  private

  def is_others?(item_name)
    !@@special_items.include?(item_name)
  end

  def increase_quality(item, options = {})
    options = {times: 1}.merge(options)

    options[:times].times do
      return if item.quality >= 50
      item.quality += 1
    end
  end

  def decrease_quality(item, options = {})
    options = {times: 1}.merge(options)

    options[:times].times do
      return if item.quality <= 0
      item.quality -= 1
    end
  end

  def decrease_sell_in(item)
    item.sell_in -= 1
  end

  def reset_quality(item)
    item.quality = 0
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
