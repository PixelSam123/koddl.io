// SHARED SCRIPT

// Theme picker Start
function applyColorTheme(themeName) {
  document.documentElement.className = themeName
}

const themeCombobox = document.getElementById('theme-combobox')
themeCombobox.addEventListener('change', (event) => {
  applyColorTheme(event.target.value)
})
// Theme picker End
