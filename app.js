(() => {
  'use strict';

  // Demo records are taken from the original Java project's sample SQL INSERT.
  // Storage is per browser/device; this is not a real shared student database.
  const STORAGE_KEY = 'prisca-student-platform-demo-v1';
  const sampleRecords = [
    {studentNumber:'S001',name:'Alice Johnson',enrolledModule:'Software Engineering',enrollmentDate:'2024-01-10',lecturerName:'Dr. Smith',flag:true},
    {studentNumber:'S002',name:'Bob Brown',enrolledModule:'Data Structures',enrollmentDate:'2024-02-12',lecturerName:'Prof. Davis',flag:false},
    {studentNumber:'S003',name:'Carol White',enrolledModule:'Operating Systems',enrollmentDate:'2024-03-15',lecturerName:'Dr. Martinez',flag:true},
    {studentNumber:'S004',name:'David Green',enrolledModule:'Database Systems',enrollmentDate:'2024-04-18',lecturerName:'Prof. Lee',flag:false},
    {studentNumber:'S005',name:'Eva Black',enrolledModule:'Network Security',enrollmentDate:'2024-05-20',lecturerName:'Dr. Clark',flag:true}
  ];
  const $ = id => document.getElementById(id);
  const cloneSamples = () => sampleRecords.map(record => ({...record}));
  const dateFormatter = new Intl.DateTimeFormat('en-ZA',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'});
  const normal = text => String(text).trim().toLocaleLowerCase();
  let editingNumber = null;
  let toastTimeout;

  function isIsoDate(s){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(s+'T00:00:00.000Z');
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10)===s;
  }
  function validRecord(x){
    return x && typeof x.studentNumber==='string' && x.studentNumber.trim().length>0 && x.studentNumber.length<=10 &&
      typeof x.name==='string' && x.name.trim().length>0 && x.name.length<=100 &&
      typeof x.enrolledModule==='string' && x.enrolledModule.trim().length>0 && x.enrolledModule.length<=100 &&
      typeof x.lecturerName==='string' && x.lecturerName.trim().length>0 && x.lecturerName.length<=100 &&
      typeof x.enrollmentDate==='string' && isIsoDate(x.enrollmentDate) && typeof x.flag==='boolean';
  }
  function loadRecords(){
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if(saved===null) return cloneSamples();
      const result = JSON.parse(saved);
      return Array.isArray(result)?result.filter(validRecord):cloneSamples();
    } catch { return cloneSamples(); }
  }
  let records = loadRecords();
  function save(){
    try {localStorage.setItem(STORAGE_KEY,JSON.stringify(records));}
    catch { notify('Unable to save to browser storage. Changes may disappear when you close the page.'); }
  }
  function notify(message){
    const toast=$('toast');
    toast.textContent=message;toast.hidden=false;
    clearTimeout(toastTimeout);
    toastTimeout=setTimeout(()=>{toast.hidden=true;},3300);
  }
  function displayDate(value){return dateFormatter.format(new Date(value+'T00:00:00Z'));}
  function cell(row,text,cls){const el=document.createElement('td');el.textContent=text;if(cls)el.className=cls;row.append(el);return el;}
  function renderFilters(){
    const filter=$('module-filter');
    const selected=filter.value;
    const modules=[...new Set(records.map(x=>x.enrolledModule.trim()))].sort((a,b)=>a.localeCompare(b));
    filter.replaceChildren(new Option('All modules','all'));
    modules.forEach(name=>filter.add(new Option(name,name)));
    filter.value=modules.includes(selected)?selected:'all';
  }
  function renderModuleBreakdown(){
    const container=$('module-breakdown');
    container.replaceChildren();
    const counts=new Map();
    records.forEach(r=>counts.set(r.enrolledModule,(counts.get(r.enrolledModule)||0)+1));
    const sorted=[...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,5);
    if(!sorted.length){const p=document.createElement('p');p.className='module-empty';p.textContent='No module data yet.';container.append(p);return;}
    const max=sorted[0][1];
    sorted.forEach(([name,count])=>{
      const row=document.createElement('div');row.className='module-row';
      const heading=document.createElement('div');heading.className='module-label';
      const nameEl=document.createElement('span');nameEl.textContent=name;
      const number=document.createElement('strong');number.textContent=String(count);
      heading.append(nameEl,number);
      const track=document.createElement('div');track.className='module-track';
      const bar=document.createElement('div');bar.className='module-fill';bar.style.width=(count/max*100)+'%';
      track.append(bar);row.append(heading,track);container.append(row);
    });
  }
  function render(){
    $('student-count').textContent=String(records.length);
    $('module-count').textContent=String(new Set(records.map(r=>normal(r.enrolledModule))).size);
    $('lecturer-count').textContent=String(new Set(records.map(r=>normal(r.lecturerName))).size);
    $('flag-count').textContent=String(records.filter(r=>r.flag).length);
    renderFilters();renderModuleBreakdown();
    const query=normal($('search').value);const moduleFilter=$('module-filter').value;
    const visible=records.filter(r=>(moduleFilter==='all'||r.enrolledModule===moduleFilter)&&
      [r.name,r.studentNumber,r.enrolledModule,r.lecturerName].some(field=>normal(field).includes(query)));
    const body=$('student-table');body.replaceChildren();
    for(const student of visible){
      const tr=document.createElement('tr');
      cell(tr,student.name,'student-name');
      cell(tr,student.studentNumber,'student-id');
      const moduleCell=document.createElement('td');const chip=document.createElement('span');chip.className='module-chip';chip.textContent=student.enrolledModule;moduleCell.append(chip);tr.append(moduleCell);
      cell(tr,displayDate(student.enrollmentDate));cell(tr,student.lecturerName);
      const flagCell=document.createElement('td');const flag=document.createElement('span');flag.className='flag-chip '+(student.flag?'yes':'no');flag.textContent=student.flag?'Yes':'No';flagCell.append(flag);tr.append(flagCell);
      const actionCell=document.createElement('td');const actions=document.createElement('div');actions.className='action-buttons';
      for(const [name,action] of [['Edit','edit'],['Delete','delete']]){
        const btn=document.createElement('button');btn.type='button';btn.className='action-button'+(action==='delete'?' delete':'');btn.textContent=name;
        btn.dataset.action=action;btn.dataset.studentNumber=student.studentNumber;
        btn.setAttribute('aria-label',name+' '+student.name);actions.append(btn);
      }
      actionCell.append(actions);tr.append(actionCell);body.append(tr);
    }
    $('empty-state').hidden=visible.length!==0;
    $('table-summary').textContent='Showing '+visible.length+' of '+records.length+' students';
    $('export-button').disabled=records.length===0;
  }
  function clearForm(){
    editingNumber=null;$('record-form').reset();$('form-error').hidden=true;$('form-error').textContent='';
    $('form-title').textContent='Register a student';$('form-description').textContent='Fill in the details to create a new student record.';
    $('submit-button').textContent='＋ Register student';
  }
  function editStudent(studentNumber){
    const record=records.find(r=>r.studentNumber===studentNumber);if(!record)return;
    editingNumber=studentNumber;
    $('student-number').value=record.studentNumber;
    $('student-name').value=record.name;
    $('student-module').value=record.enrolledModule;
    $('student-date').value=record.enrollmentDate;
    $('lecturer-name').value=record.lecturerName;
    $('record-flag').value=String(record.flag);
    $('form-error').hidden=true;
    $('form-title').textContent='Edit student record';$('form-description').textContent='Change the details and save your updates.';
    $('submit-button').textContent='✓ Save changes';
    $('student-form').scrollIntoView({behavior:'smooth',block:'start'});
    $('student-number').focus({preventScroll:true});
  }
  function showError(message){$('form-error').textContent=message;$('form-error').hidden=false;}
  $('student-table').addEventListener('click',event=>{
    const button=event.target.closest('button[data-action]');if(!button)return;
    const found=records.find(r=>r.studentNumber===button.dataset.studentNumber);if(!found)return;
    if(button.dataset.action==='edit'){editStudent(found.studentNumber);return;}
    if(!window.confirm('Delete '+found.name+' ('+found.studentNumber+') from this browser demo?'))return;
    records=records.filter(r=>r!==found);
    if(editingNumber===found.studentNumber)clearForm();
    save();render();notify('Student record deleted.');
  });
  $('record-form').addEventListener('submit',event=>{
    event.preventDefault();
    const record={studentNumber:$('student-number').value.trim(),name:$('student-name').value.trim(),
      enrolledModule:$('student-module').value.trim(),enrollmentDate:$('student-date').value,
      lecturerName:$('lecturer-name').value.trim(),flag:$('record-flag').value==='true'};
    if(!validRecord(record)){
      showError('Complete all required fields. Student number must be 10 characters or fewer, and date must be valid.');return;
    }
    if(records.some(r=>normal(r.studentNumber)===normal(record.studentNumber)&&r.studentNumber!==editingNumber)){
      showError('This student number is already in use.');return;
    }
    if(editingNumber===null){records.push(record);save();render();clearForm();notify('Student registered successfully.');}
    else {
      const index=records.findIndex(r=>r.studentNumber===editingNumber);
      if(index<0){clearForm();notify('That student record no longer exists.');return;}
      records[index]=record;save();render();clearForm();notify('Student record updated.');
    }
  });
  $('clear-button').addEventListener('click',clearForm);
  $('search').addEventListener('input',render);
  $('module-filter').addEventListener('change',render);
  $('reset-button').addEventListener('click',()=>{
    if(!window.confirm('Replace your browser data with the original five sample student records?'))return;
    records=cloneSamples();save();clearForm();$('search').value='';$('module-filter').value='all';render();notify('Sample records restored.');
  });
  $('export-button').addEventListener('click',()=>{
    // CSV-escape text and prefix potentially formula-like values to prevent spreadsheet formula execution.
    const safeCSV=value=>{
      let text=String(value);
      if(/^[\s\t\r\n]*[=+\-@]/.test(text))text="'"+text;
      return '"'+text.replace(/"/g,'""')+'"';
    };
    const rows=[['Student Number','Full Name','Enrolled Module','Enrolment Date','Lecturer Name','Record Flag'],...records.map(r=>[r.studentNumber,r.name,r.enrolledModule,r.enrollmentDate,r.lecturerName,r.flag?'Yes':'No'])];
    const csv='\uFEFF'+rows.map(row=>row.map(safeCSV).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='student-records-demo.csv';document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);notify('CSV file exported.');
  });
  render();
})();
