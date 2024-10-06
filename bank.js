const { Command } = require('commander')
const fs = require('fs')

const program = new Command()

// Налаштування аргументів командного рядка
program
	.requiredOption('-i, --input <path>', 'шлях до файлу з даними (JSON)')
	.option('-o, --output <path>', 'шлях до файлу для запису результату')
	.option('-d, --display', 'виведення результату у консоль')

program.parse(process.argv)

const options = program.opts()

// Перевіряємо, чи існує вхідний файл
if (!fs.existsSync(options.input)) {
	console.error('Cannot find input file')
	process.exit(1)
}

// Читаємо файл
const data = fs.readFileSync(options.input, 'utf8')

// Парсимо JSON
let jsonData
try {
	jsonData = JSON.parse(data)
} catch (err) {
	console.error('Помилка парсингу JSON:', err.message)
	process.exit(1)
}

// Фільтруємо дані (умова для варіанту 7)
const result = jsonData.filter(item => item.ku === 13 && item.value > 5)

// Виведення результату
if (options.display) {
	console.log(result)
}

// Запис результату у файл, якщо задано шлях
if (options.output) {
	fs.writeFileSync(options.output, JSON.stringify(result, null, 2), 'utf8')
	console.log(`Результат записано у файл: ${options.output}`)
}

// Якщо ні display, ні output не задано, нічого не робимо
if (!options.display && !options.output) {
	console.log(
		'Нічого не виводимо, оскільки не задано опцій для виведення результату.'
	)
}
