const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');

router.post('/', (req, res) => {
    const base = req.body[0];
    let items = req.body.slice(1);

    // Calculate overlap intervals
    getIntervals(base, items);

    // Filter greater than 30 mins
    items = items.filter(item => item.intDuration >= 30);

    if (items.length < 1) {
        // Error
        res.json({
            "BrilliantLunch": {
                "Matched": false,
                "Time": null
            }
        });
    } else if (items.length == 1) {
        // return result
        res.json({
            "BrilliantLunch": {
                "Matched": true,
                "Time": {
                    "Start": items[0].Start,
                    "End": items[0].End
                }
            }
        });
    } else {
        // Filter by highest duration
        const maxDuration = Math.max.apply(null, items.map(item => item.intDuration));
        console.log(maxDuration)
        items = items.filter(item => item.intDuration == maxDuration);

        if (items.length == 1) {
            // return result
            res.json({
                "BrilliantLunch": {
                    "Matched": true,
                    "Time": {
                        "Start": items[0].Start,
                        "End": items[0].End
                    }
                }
            });
        } else {
            // Filter by earliest start time
            const minStart = Math.min.apply(null, items.map(item => item.intStart));
            items = items.filter(item => item.intStart == minStart);

            if (items.length == 1) {
                // return result
                res.json({
                    "BrilliantLunch": {
                        "Matched": true,
                        "Time": {
                            "Start": items[0].Start,
                            "End": items[0].End
                        }
                    }
                });
            } else {
                const item = items[Math.floor(Math.random() * items.length)];
                res.json({
                    "BrilliantLunch": {
                        "Matched": true,
                        "Time": {
                            "Start": item.Start,
                            "End": item.End
                        }
                    }
                });
            }

        }
    }

});

function getIntervals(base, items) {
    for (let item of items) {
        item.intStart = base.Start;
        if (item.Start > base.Start) {
            item.intStart = item.Start;
        }
        item.intEnd = base.End;
        if (item.End < base.End) {
            item.intEnd = item.End;
        }
        item.intDuration = item.intEnd - item.intStart;
    }

    return items;
}


module.exports = router;