using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace FapiViz.Controllers
{
    public class HomeController : Controller
    {
        // GET: /Home/
        public ActionResult Index()
        {
            return View();
        }

        // GET: /Home/FapiDeployment
        public ContentResult FapiDeployment()
        {
            var handler = new HttpClientHandler
                {
                    UseDefaultCredentials = true
                };
            var httpClient = new HttpClient(handler)
                           {
                               BaseAddress = new Uri("http://ctdri/")
                           };

            var result = httpClient.GetStringAsync("FlightDeployment?excel=1").Result;
            const string fileName = "file";

            HttpContext.Response.AddHeader("Content-Disposition", string.Format("attachment; filename=\"{0}.csv\"", fileName));
            return new ContentResult()
                {
                    Content = result, 
                    ContentType = string.Format("text/csv; name=\"{0}.csv\"", fileName)
                };
        }

    }
}
