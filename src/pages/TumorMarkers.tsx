import React, { useState } from 'react';
import { Beaker } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SectionCard from '@/components/layout/SectionCard';
import ClinicalDisclaimer from '@/components/layout/ClinicalDisclaimer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useOncology } from '@/context/OncologyContext';
import { MARKER_RISE_ALERT_PCT, TUMOR_MARKER_REFERENCE } from '@/lib/oncology/thresholds';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const markerKeys = Object.keys(TUMOR_MARKER_REFERENCE);

const TumorMarkers = () => {
  const { markers, addMarker } = useOncology();
  const { toast } = useToast();
  const [marker, setMarker] = useState('cea');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');

  const ref = TUMOR_MARKER_REFERENCE[marker];
  const series = markers
    .filter((m) => m.marker === marker)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => ({ date: m.date.slice(5), value: m.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(value);
    if (!value || Number.isNaN(num)) {
      toast({ title: 'Enter a numeric result', variant: 'destructive' });
      return;
    }
    addMarker(marker, num, date || undefined);
    setValue('');
    toast({ title: `${ref.label} result saved` });
  };

  const summaries = markerKeys
    .map((key) => {
      const s = markers.filter((m) => m.marker === key).sort((a, b) => a.date.localeCompare(b.date));
      if (!s.length) return null;
      const curr = s[s.length - 1];
      const prev = s.length > 1 ? s[s.length - 2] : undefined;
      const change = prev ? ((curr.value - prev.value) / prev.value) * 100 : undefined;
      return { key, curr, change };
    })
    .filter(Boolean) as { key: string; curr: { value: number; date: string }; change?: number }[];

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Tier 2 · Response tracking"
        title="Tumour markers & liquid biopsy"
        description={`Trend serum markers and ctDNA VAF between scans. A rise of ${MARKER_RISE_ALERT_PCT}% or more between consecutive results is flagged.`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Add result" icon={Beaker}>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-1.5">
              <Label>Marker</Label>
              <Select value={marker} onValueChange={setMarker}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {markerKeys.map((k) => (
                    <SelectItem key={k} value={k}>
                      {TUMOR_MARKER_REFERENCE[k].label} — {TUMOR_MARKER_REFERENCE[k].note}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="value">Result ({ref.unit})</Label>
              <Input id="value" type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} />
              <p className="text-caption">Upper reference limit {ref.upperLimit} {ref.unit}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Collection date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">
              Save result
            </Button>
          </form>
        </SectionCard>

        <SectionCard className="lg:col-span-2" title={`${ref.label} trend`} description={ref.note}>
          {series.length === 0 ? (
            <p className="text-sm text-muted-foreground">No results recorded for {ref.label}.</p>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="value" name={`${ref.label} (${ref.unit})`} stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Latest values" description="Compared against reference limits and the previous result">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {summaries.map(({ key, curr, change }) => {
            const r = TUMOR_MARKER_REFERENCE[key];
            const high = curr.value > r.upperLimit;
            const rising = (change ?? 0) >= MARKER_RISE_ALERT_PCT;
            return (
              <div
                key={key}
                className={`rounded-lg border p-4 ${rising ? 'border-grade-3/40 bg-grade-3/10' : 'border-border bg-muted/30'}`}
              >
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold">{r.label}</p>
                  <span className={`text-sm font-semibold ${high ? 'text-grade-3' : 'text-success'}`}>
                    {curr.value} {r.unit}
                  </span>
                </div>
                <p className="text-caption">
                  {curr.date} · limit {r.upperLimit} {r.unit}
                  {change !== undefined ? ` · ${change >= 0 ? '+' : ''}${change.toFixed(0)}% vs previous` : ''}
                </p>
              </div>
            );
          })}
          {summaries.length === 0 && <p className="text-sm text-muted-foreground">No marker results yet.</p>}
        </div>
      </SectionCard>

      <ClinicalDisclaimer />
    </PageContainer>
  );
};

export default TumorMarkers;
