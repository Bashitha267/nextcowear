import { supabase } from './supabase';

export interface SiteSetting {
    key: string;
    value: any;
}

export const SettingsService = {
    async get(key: string) {
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', key)
            .single();

        if (error) {
            console.warn(`Setting ${key} not found or error fetching:`, error.message);
            return null;
        }
        return data?.value;
    },

    async set(key: string, value: any) {
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key, value }, { onConflict: 'key' });

        if (error) {
            console.error(`Error saving setting ${key}:`, error);
            throw error;
        }
    },

    // Specific helpers
    async getLegalDocument(type: 'refund' | 'shipping' | 'terms') {
        const key = `legal_${type}`;
        const data = await this.get(key);
        return data?.content || '';
    },

    async setLegalDocument(type: 'refund' | 'shipping' | 'terms', content: string) {
        const key = `legal_${type}`;
        await this.set(key, { content, updated_at: new Date().toISOString() });
    },

    async getSizeChart() {
        const data = await this.get('size_chart');
        return data || { url: '', description: '' };
    },

    async setSizeChart(url: string, description: string) {
        await this.set('size_chart', { url, description, updated_at: new Date().toISOString() });
    }
};
