# Performance testing - k6

## Instructions

1. Start app with development configurations

```bash
docker compose up
```

2. Run k6 commands in root directory

## Testing

### Load Assignment Page

#### Run
```bash
k6 run k6/performance-test-load-assignment-page.js
```
#### Results

     execution: local
        script: k6/performance-test-load-assignment-page.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 40s max duration (incl. graceful stop):
              * default: 10 looping VUs for 10s (gracefulStop: 30s)


     data_received..................: 9.3 MB 906 kB/s
     data_sent......................: 28 kB  2.7 kB/s
     http_req_blocked...............: avg=46.67µs  min=1µs      med=3µs      max=1.58ms   p(90)=5µs      p(95)=6.34µs
     http_req_connecting............: avg=12.37µs  min=0s       med=0s       max=491µs    p(90)=0s       p(95)=0s
     http_req_duration..............: avg=287.05ms min=104.19ms med=286.88ms max=358.31ms p(90)=313.35ms p(95)=325.2ms
       { expected_response:true }...: avg=287.05ms min=104.19ms med=286.88ms max=358.31ms p(90)=313.35ms p(95)=325.2ms
     http_req_failed................: 0.00%  ✓ 0         ✗ 354
     http_req_receiving.............: avg=155.64µs min=23µs     med=95.5µs   max=1.31ms   p(90)=336.4µs  p(95)=518.84µs
     http_req_sending...............: avg=16.85µs  min=3µs      med=13µs     max=219µs    p(90)=23µs     p(95)=33.14µs
     http_req_tls_handshaking.......: avg=0s       min=0s       med=0s       max=0s       p(90)=0s       p(95)=0s
     http_req_waiting...............: avg=286.88ms min=103.97ms med=286.74ms max=358.17ms p(90)=313.27ms p(95)=325.09ms
     http_reqs......................: 354    34.350666/s
     iteration_duration.............: avg=287.19ms min=106.42ms med=286.99ms max=360.45ms p(90)=313.44ms p(95)=325.26ms
     iterations.....................: 354    34.350666/s
     vus............................: 10     min=10      max=10
     vus_max........................: 10     min=10      max=10


running (10.3s), 00/10 VUs, 354 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  10s

### Submit Assignment

#### Run
```bash
k6 run k6/performance-test-add-assignment-submission.js
```
#### Results
     execution: local
        script: k6/performance-test-add-assignment-submission.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 40s max duration (incl. graceful stop):
              * default: 10 looping VUs for 10s (gracefulStop: 30s)


     data_received..................: 805 kB 80 kB/s
     data_sent......................: 484 kB 48 kB/s
     http_req_blocked...............: avg=8.26µs  min=0s     med=2µs     max=2.13ms   p(90)=4µs     p(95)=5µs
     http_req_connecting............: avg=2.32µs  min=0s     med=0s      max=536µs    p(90)=0s      p(95)=0s
     http_req_duration..............: avg=47.57ms min=5.93ms med=45.92ms max=416.95ms p(90)=75.43ms p(95)=80.1ms
       { expected_response:true }...: avg=47.57ms min=5.93ms med=45.92ms max=416.95ms p(90)=75.43ms p(95)=80.1ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 2105
     http_req_receiving.............: avg=65.97µs min=7µs    med=39µs    max=4.39ms   p(90)=101µs   p(95)=158.79µs
     http_req_sending...............: avg=24.41µs min=2µs    med=11µs    max=12.26ms  p(90)=26µs    p(95)=39µs
     http_req_tls_handshaking.......: avg=0s      min=0s     med=0s      max=0s       p(90)=0s      p(95)=0s
     http_req_waiting...............: avg=47.48ms min=5.9ms  med=45.69ms max=416.8ms  p(90)=75.37ms p(95)=79.95ms
     http_reqs......................: 2105   209.091185/s
     iteration_duration.............: avg=47.69ms min=5.97ms med=45.98ms max=417.95ms p(90)=75.71ms p(95)=80.31ms
     iterations.....................: 2105   209.091185/s
     vus............................: 10     min=10       max=10
     vus_max........................: 10     min=10       max=10


running (10.1s), 00/10 VUs, 2105 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  10s

## Summary and Analysis of the results

The performance test results show that app have good performance and particularly submitting assignment functionality. The load assignment page have still room for optimization. Both tests show 0% failure rate which implies that the web app is reliable. "Load assignment page test" handled about 34 request per second with 10 concurrent user whereas "Submit Assignments test" handled 209 with same setup. While loading page there is more going on that could be restructured.

### Load Assignment Page:

Average response time (http_req_duration): 287.05ms
90th percentile response time: 313.35ms
95th percentile response time: 325.2ms
Failed requests: 0%
### Submit Assignments:

Average response time (http_req_duration): 47.57ms
90th percentile response time: 75.43ms
95th percentile response time: 80.1ms
Failed requests: 0%