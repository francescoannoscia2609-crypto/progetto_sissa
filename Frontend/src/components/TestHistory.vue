<template>
  <div class="page">
    <div class="container">
      <div class="header">
        <h1>Storico Risultati Esami</h1>
        <div class="user-info" v-if="currentUser">
          <p><strong>Paziente:</strong> {{ currentUser.nome }} {{ currentUser.cognome }}</p>
          <p>
            <strong>Genere:</strong> {{ currentUser.sesso === 'M' ? 'Maschio' : 'Femmina' }} |
            <strong>Età:</strong> {{ calculateAge(currentUser.data_nascita) }} anni
          </p>
        </div>
      </div>

      <!-- Filtri -->
      <div class="filters">
        <div class="filter-group">
          <label for="filter-biomarker">Filtra per Biomarker:</label>
          <select v-model="selectedBiomarker" id="filter-biomarker">
            <option value="">Tutti i biomarker</option>
            <option value="1">Glicemia</option>
            <option value="2">Colesterolo Totale</option>
            <option value="3">Emoglobina (Hb)</option>
            <option value="4">Globuli Rossi (RBC)</option>
            <option value="5">Globuli Bianchi (WBC)</option>
            <option value="6">Piastrine (PLT)</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="filter-date">Data da:</label>
          <input v-model="filterFromDate" type="date" id="filter-date" />
        </div>
        <div class="filter-group">
          <label for="filter-date-to">Data a:</label>
          <input v-model="filterToDate" type="date" id="filter-date-to" />
        </div>
        <button class="btn-filter" @click="resetFilters">Azzera Filtri</button>
      </div>

      <!-- Storico Risultati Raggruppati per Data -->
      <div v-if="filteredAndGroupedResults.length > 0" class="history-section">
        <div v-for="group in filteredAndGroupedResults" :key="group.date" class="date-group">
          <h3 class="date-header">{{ formatDate(group.date) }}</h3>

          <table class="results-table">
            <thead>
              <tr>
                <th>Biomarker</th>
                <th>Valore Misurato</th>
                <th>Unità</th>
                <th>Range Normale</th>
                <th>Esito</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="result in group.results"
                :key="result.result_id"
                :class="`status-${result.esito.toLowerCase()}`"
              >
                <td class="exam-name">{{ getBiomarkerName(result.biomarker_id) }}</td>
                <td class="valore">{{ result.valore_misurato }}</td>
                <td class="unita">{{ getBiomarkerUnit(result.biomarker_id) }}</td>
                <td class="range">{{ getBiomarkerRange(result.biomarker_id) }}</td>
                <td class="esito">
                  <span :class="`badge badge-${result.esito.toLowerCase()}`">
                    {{ result.esito }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Nessun Risultato -->
      <div v-else class="no-results">
        <p>Nessun storico disponibile con i filtri selezionati.</p>
      </div>

      <!-- Azioni -->
      <div class="actions">
        <button class="btn-primary" @click="goToDashboard">Torna al Dashboard</button>
        <button class="btn-secondary" @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup name="TestHistory">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dati dell'utente loggato
const currentUser = ref({
  user_id: 1,
  nome: 'Luca',
  cognome: 'Verdi',
  email: 'bambino@test.com',
  data_nascita: '2016-01-01',
  sesso: 'M',
})

// Dati dei Biomarker
const BiomarkerData = {
  Glicemia: { id: 1, unit: 'mg/dL', range: '60-100' },
  'Colesterolo Totale': { id: 2, unit: 'mg/dL', range: '120-170' },
  'Emoglobina (Hb)': { id: 3, unit: 'g/dL', range: '11.5-15.5' },
  'Globuli Rossi (RBC)': { id: 4, unit: '10^6/uL', range: '4.0-5.2' },
  'Globuli Bianchi (WBC)': { id: 5, unit: '10^3/uL', range: '5.0-15.0' },
  'Piastrine (PLT)': { id: 6, unit: '10^3/uL', range: '150-450' },
}

// Storico risultati con dati mock
const testHistoryData = ref([
  {
    result_id: 1,
    user_id: 1,
    biomarker_id: 1,
    valore_misurato: 110.0,
    data_test: '2026-03-16',
    esito: 'ALTO',
  },
  {
    result_id: 2,
    user_id: 1,
    biomarker_id: 2,
    valore_misurato: 210.0,
    data_test: '2026-03-16',
    esito: 'ALTO',
  },
  {
    result_id: 3,
    user_id: 1,
    biomarker_id: 3,
    valore_misurato: 13.5,
    data_test: '2026-03-16',
    esito: 'NORMALE',
  },
  {
    result_id: 4,
    user_id: 1,
    biomarker_id: 1,
    valore_misurato: 105.0,
    data_test: '2026-03-09',
    esito: 'ALTO',
  },
  {
    result_id: 5,
    user_id: 1,
    biomarker_id: 2,
    valore_misurato: 205.0,
    data_test: '2026-03-09',
    esito: 'ALTO',
  },
  {
    result_id: 6,
    user_id: 1,
    biomarker_id: 4,
    valore_misurato: 4.5,
    data_test: '2026-03-09',
    esito: 'NORMALE',
  },
  {
    result_id: 7,
    user_id: 1,
    biomarker_id: 1,
    valore_misurato: 95.0,
    data_test: '2026-03-02',
    esito: 'NORMALE',
  },
  {
    result_id: 8,
    user_id: 1,
    biomarker_id: 5,
    valore_misurato: 7.5,
    data_test: '2026-03-02',
    esito: 'NORMALE',
  },
  {
    result_id: 9,
    user_id: 1,
    biomarker_id: 6,
    valore_misurato: 250.0,
    data_test: '2026-02-24',
    esito: 'NORMALE',
  },
])

// Filtri
const selectedBiomarker = ref('')
const filterFromDate = ref('')
const filterToDate = ref('')

// Calcola l'età
function calculateAge(dataNascita) {
  const oggi = new Date()
  const dataNascitaObj = new Date(dataNascita)
  let age = oggi.getFullYear() - dataNascitaObj.getFullYear()
  const mese = oggi.getMonth() - dataNascitaObj.getMonth()
  if (mese < 0 || (mese === 0 && oggi.getDate() < dataNascitaObj.getDate())) {
    age--
  }
  return age
}

// Ottiene il nome del biomarker
function getBiomarkerName(biomarkerId) {
  for (const [name, data] of Object.entries(BiomarkerData)) {
    if (data.id === biomarkerId) return name
  }
  return 'Sconosciuto'
}

// Ottiene l'unità di misura
function getBiomarkerUnit(biomarkerId) {
  for (const data of Object.values(BiomarkerData)) {
    if (data.id === biomarkerId) return data.unit
  }
  return ''
}

// Ottiene il range
function getBiomarkerRange(biomarkerId) {
  for (const data of Object.values(BiomarkerData)) {
    if (data.id === biomarkerId) return data.range
  }
  return ''
}

// Formatta la data
function formatDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('it-IT', options)
}

// Filtra e raggruppa i risultati
const filteredAndGroupedResults = computed(() => {
  let filtered = testHistoryData.value

  // Filtra per biomarker
  if (selectedBiomarker.value) {
    filtered = filtered.filter((r) => r.biomarker_id === parseInt(selectedBiomarker.value))
  }

  // Filtra per data da
  if (filterFromDate.value) {
    filtered = filtered.filter((r) => new Date(r.data_test) >= new Date(filterFromDate.value))
  }

  // Filtra per data a
  if (filterToDate.value) {
    filtered = filtered.filter((r) => new Date(r.data_test) <= new Date(filterToDate.value))
  }

  // Raggruppa per data (in ordine decrescente)
  const grouped = {}
  filtered.forEach((result) => {
    if (!grouped[result.data_test]) {
      grouped[result.data_test] = []
    }
    grouped[result.data_test].push(result)
  })

  // Ordina le date in ordine decrescente e calcola le variazioni
  const sorted = Object.entries(grouped)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .map(([date, results]) => {
      results = results.map((result) => {
        let variazione = null
        // Calcola la variazione rispetto al test precedente dello stesso biomarker
        const previousResult = testHistoryData.value
          .filter(
            (r) => r.biomarker_id === result.biomarker_id && new Date(r.data_test) < new Date(date),
          )
          .sort((a, b) => new Date(b.data_test) - new Date(a.data_test))[0]

        if (previousResult) {
          variazione =
            ((result.valore_misurato - previousResult.valore_misurato) /
              previousResult.valore_misurato) *
            100
        }
        return { ...result, variazione }
      })
      return { date, results }
    })

  return sorted
})

// Resetta i filtri
function resetFilters() {
  selectedBiomarker.value = ''
  filterFromDate.value = ''
  filterToDate.value = ''
}

// Torna al dashboard
function goToDashboard() {
  router.push('/dashboard')
}

// Logout
function logout() {
  router.push('/login')
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff 0%, #f9f9f9 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.header {
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 20px;
}

.header h1 {
  margin: 0 0 15px 0;
  color: #b00020;
  font-size: 2rem;
  font-weight: 700;
}

.user-info {
  color: #666;
  font-size: 0.95rem;
}

.user-info p {
  margin: 5px 0;
}

/* Filtri */
.filters {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
  font-size: 0.9rem;
}

.filter-group input,
.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #b00020;
  box-shadow: 0 0 0 2px rgba(176, 0, 32, 0.1);
}

.btn-filter {
  padding: 8px 16px;
  background: #b00020;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.btn-filter:hover {
  background: #8a0018;
}

/* Storico Risultati */
.history-section {
  margin-bottom: 30px;
}

.date-group {
  margin-bottom: 25px;
}

.date-header {
  color: #b00020;
  font-size: 1.1rem;
  margin: 20px 0 10px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.results-table thead {
  background: #f5f5f5;
}

.results-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}

.results-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.results-table tbody tr:hover {
  background: #f9f9f9;
}

.exam-name {
  font-weight: 600;
  color: #333;
}

.valore {
  font-weight: 600;
  color: #b00020;
}

.unita {
  color: #666;
  font-size: 0.9rem;
}

.range {
  color: #999;
  font-size: 0.85rem;
}

.esito {
  text-align: center;
}

/* Badge per gli esiti */
.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-basso {
  background: #ffe0e0;
  color: #b00020;
}

.badge-normale {
  background: #e0f7e0;
  color: #2e7d32;
}

.badge-alto {
  background: #fff3e0;
  color: #e65100;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 1.1rem;
}

/* Azioni */
.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 30px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #b00020;
  color: white;
}

.btn-primary:hover {
  background: #8a0018;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(176, 0, 32, 0.3);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .results-table {
    font-size: 0.85rem;
  }

  .results-table th,
  .results-table td {
    padding: 8px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
