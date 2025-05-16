import * as React from 'react';
import { useState, useEffect } from 'react';
import { Panel, PanelType, Stack, DefaultButton, Checkbox, Text, TextField } from 'office-ui-fabric-react';

const FilterComponent = (props: any) => {
  const [filterobjectHeader, setFilterobjectHeader] = useState<any[]>([]);
  const [showMore, setShowMore] = useState<{ [key: string]: boolean }>({});
  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({});
  const [tempFilters, setTempFilters] = useState<any>({}); 

  const normalizeValue = (val: any): string => {
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.map(normalizeValue).join(', ');
    if (typeof val === 'object' && val !== null)
      return val.title || val.name || val.displayName || JSON.stringify(val);
    return '';
  };

  useEffect(() => {
    if (props?.columns && props?.data) {
      const headers = props.columns.map((col: any) => {
        const uniqueNormalizedValues = Array.from(
          new Set(
            props.data
              .map((item: any) => normalizeValue(item[col.fieldName || col.key]))
              .filter((v: any) => v !== '')
          )
        );
        const filtervalue = uniqueNormalizedValues.map((val: string) => ({ key: val, text: val }));
        return {
          ...col,
          filtervalue
        };
      });
      setFilterobjectHeader(headers);
    }
  }, [props.columns, props.data, props.smartFilterData]);

  useEffect(() => {
    if (props?.filters) {
      setTempFilters(props.filters);
    }
  }, [props.filters]);

  const toggleCheckbox = (key: string, value: string, checked: boolean) => {
    setTempFilters((prev: any) => {
      const current = prev[key] || [];
      let updated = checked
        ? [...current, value]
        : current.filter((v: string) => v !== value);

      const newFilters = { ...prev };

      if (updated.length > 0) {
        newFilters[key] = updated;
      } else {
        delete newFilters[key]; 
      }

      return newFilters;
    });
  };

  const objectEntries = (obj: any): [string, any][] =>
    Object.keys(obj).map(key => [key, obj[key]]);

  const applyFilters = () => {
    const filtered = props.data.filter((item: any) => {
      return objectEntries(tempFilters).every(([filterKey, filterVals]: any) => {
        const col = props.columns.find((c: any) => c.key === filterKey);
        const fieldKey = col?.fieldName || col?.key;
        const rawValue = item[fieldKey];
        const normalizedVal = normalizeValue(rawValue);
        return filterVals.includes(normalizedVal);
      });
    });
    props?.setFilters(tempFilters); 
    props?.setSmartFilterData(filtered);
    props.setOpenSmartFilter(false);
  };

  const handleSearchChange = (key: string, value: string) => {
    setSearchTerms(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Panel
      type={PanelType.large}
      headerText="Smart Filter"
      isOpen={props?.openSmartFilter}
      onDismiss={() => props?.setOpenSmartFilter(false)}
      isBlocking={true}
    >
      <Stack className="mb-5" tokens={{ childrenGap: 24 }}>
        <div className="row">
          {filterobjectHeader.map((col: any, index: number) => {
            if (col?.name !== 'Action') {
              const searchTerm = searchTerms[col.key]?.toLowerCase() || '';
              const filteredOptions = col.filtervalue.filter((item: any) =>
                item.text.toLowerCase().includes(searchTerm)
              );

              const visibleCount = showMore[col.key] ? filteredOptions.length : 6;
              return (
                <div className="col-md-4" key={index}>
                  <details className="SidebarAccordion" open>
                    <summary className="check-list-header">
                      {`Filter by ${col.name || col.key}`}
                    </summary>
                    <div className="expand-AccordionContent clearfix smartFilters">
                      <TextField
                        placeholder="Search..."
                        value={searchTerms[col.key] || ''}
                        onChange={(_, newValue) => handleSearchChange(col.key, newValue || '')}
                        styles={{ root: { marginBottom: 8 } }}
                      />
                      <Stack className="scrollbar" tokens={{ childrenGap: 6 }}>
                        {filteredOptions.slice(0, visibleCount).map((option: any) => (
                          <Checkbox
                            key={option.key}
                            label={option.text}
                            checked={tempFilters[col.key]?.includes(option.key) || false}
                            onChange={(_, checked) => toggleCheckbox(col.key, option.key, !!checked)}
                          />
                        ))}
                      </Stack>
                      {filteredOptions.length > 6 && (
                        <DefaultButton
                          text={showMore[col.key] ? 'Show less' : 'Show more'}
                          onClick={() =>
                            setShowMore(prev => ({
                              ...prev,
                              [col.key]: !prev[col.key]
                            }))
                          }
                          styles={{ root: { marginTop: 8 } }}
                        />
                      )}
                    </div>
                  </details>
                </div>
              );
            }
          })}
        </div>
        <footer className="fixed-bottom panel-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setTempFilters({});
              props?.setFilters({});
              props?.onTabClick(props?.activeKey);
              props.setOpenSmartFilter(false);
            }}
          >
            Clear Filters
          </button>
          <button type="button" className="btn btn-primary" onClick={applyFilters}>
            Apply Filters
          </button>
        </footer>
      </Stack>
    </Panel>
  );
};

export default FilterComponent;