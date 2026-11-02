// Independent example: no DOM reads and no network telemetry.
window.practiceTimeline=window.practiceTimeline||[];window.practiceTimeline.push({name:'async analytics executed',time:performance.now()});window.practiceAnalytics={executed:true,readyState:'independent'};window.dispatchEvent(new Event('practice-analytics-ready'));
