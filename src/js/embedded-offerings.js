function minutes(time) {
    const [, hour, minute, period] = time.match(/^(\d+):(\d+) (AM|PM)$/);
    return (
        (Number(hour) % 12) * 60 + Number(minute) + (period === 'PM' ? 720 : 0)
    );
}

// Source allocations keep ETH and ELA rows separate. A selectable embedded
// registration must reserve both components, with their combined credits.
function combineEmbeddedOfferings(rows, schema) {
    const periods = new Map();
    Object.values(schema)
        .flat()
        .forEach((period) => {
            if (!period.days) return;
            Object.entries(period.days).forEach(([day, slot]) => {
                const entries = periods.get(slot) || [];
                entries.push({
                    day,
                    start: minutes(period.start),
                    end: minutes(period.end),
                });
                periods.set(slot, entries);
            });
        });

    const slots = (row) => row.SLOT.split('+').map((slot) => slot.trim());
    const hours = (row) =>
        slots(row).flatMap((slot) => periods.get(slot) || []);
    const name = (row) => row.FACULTY.trim().replace(/\s+/g, ' ').toUpperCase();
    const labs = rows.filter((row) => row.TYPE === 'ELA');
    const paired = new Set();
    const result = [];

    rows.forEach((theory) => {
        if (theory.TYPE !== 'ETH') {
            if (theory.TYPE !== 'ELA') result.push(theory);
            return;
        }

        labs.forEach((lab) => {
            if (theory.CODE !== lab.CODE || name(theory) !== name(lab)) return;
            const overlaps = hours(theory).some((a) =>
                hours(lab).some(
                    (b) =>
                        a.day === b.day && a.start < b.end && b.start < a.end,
                ),
            );
            if (overlaps) return;

            result.push({
                ...theory,
                TYPE: 'ETL',
                SLOT: [...slots(theory), ...slots(lab)].join('+'),
                VENUE: `${theory.VENUE} / ${lab.VENUE}`,
                CREDITS: Number(theory.CREDITS) + Number(lab.CREDITS),
            });
            paired.add(theory);
            paired.add(lab);
        });
    });

    // Preserve incomplete source allocations for manual planning.
    rows.forEach((row) => {
        if ((row.TYPE === 'ETH' || row.TYPE === 'ELA') && !paired.has(row))
            result.push(row);
    });
    return result;
}

module.exports = { combineEmbeddedOfferings };
