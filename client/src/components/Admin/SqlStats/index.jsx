import Grid from '@mui/joy/Grid'
import PatientCountByDisease from './CountDisease'
import PatientCountByRegion from './CountRegion'
import CountAnalysisByRegion from './CountAnalysisByRegion'
import AnalysisTimeMedian from './AnalysisTimeMedian'
import AnalysisTimeMode from './AnalysisTimeMode'
import AnalysisTimeAvg from './AnalysisTimeAvg'
import YoungestAnalysis from './YoungestAnalysis'
import ListWithDiseases from './ListWithDiseases'
import ListWithAnalysisCount from './ListWithAnalysisCount'

export default function SqlStats() {
  return (
    <Grid container spacing={2} maxWidth={'100vw'} margin={2}>
      <PatientCountByDisease />
      <PatientCountByRegion />
      <CountAnalysisByRegion />
      <AnalysisTimeMedian />
      <AnalysisTimeMode />
      <AnalysisTimeAvg />
      <YoungestAnalysis />
      <ListWithDiseases />
      <ListWithAnalysisCount />
    </Grid>
  )
}
