class GildedRose
  def initialize(items)
    @@item_updaters = {
      "Aged Brie" => AgedBrieUpdater, 
      "Backstage passes to a TAFKAL80ETC concert" => BackstagePassUpdater, 
      "Sulfuras, Hand of Ragnaros" => SulfurasUpdater
    }
    @items = items
  end

  def update_quality()
    @items.each do |item|
      updater = @@item_updaters[item.name] || DefaultItemUpdater
      updater.update(item)
    end
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

# specs:
#  `quality` ranges from 0 to 50.
#
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

class DefaultItemUpdater

  def self.update(item)
    decrease_sell_in(item)
    decrease_quality(item, times: calc_times(item.sell_in))
  end
  
  protected

  def self.calc_times(sell_in)
    return 1 if sell_in >= 0
    2
  end

  def self.increase_quality(item, options = {})
    options = {times: 1}.merge(options)

    options[:times].times do
      return if item.quality >= 50
      item.quality += 1
    end
  end

  def self.decrease_quality(item, options = {})
    options = {times: 1}.merge(options)

    options[:times].times do
      return if item.quality <= 0
      item.quality -= 1
    end
  end

  def self.decrease_sell_in(item, options = {})
    options = {times: 1}.merge(options)

    options[:times].times do
      item.sell_in -= 1
    end
  end

  def self.reset_quality(item)
    item.quality = 0
  end
end

class AgedBrieUpdater < DefaultItemUpdater
  def self.update(item)
    decrease_sell_in(item)
    increase_quality(item, times: calc_times(item.sell_in))
  end
end

class BackstagePassUpdater < DefaultItemUpdater
  def self.update(item)
    decrease_sell_in(item)
    return reset_quality(item) if item.sell_in < 0
    increase_quality(item, times: calc_times(item.sell_in))
  end

  protected

  def self.calc_times(sell_in)
    case sell_in
    when 10..Float::INFINITY
      1
    when 5..9
      2
    when 0..4
      3
    end
  end
end

class SulfurasUpdater < DefaultItemUpdater
  def self.update(_item)
  end
end