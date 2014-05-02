require 'csv'
require 'pry'

max_array = []

CSV.foreach('../greenlandmeltmaps.csv') do |row|
	max_array << row
end
binding.pry

max = max_array.flatten.map(&:to_i).max


puts max

#max = 154